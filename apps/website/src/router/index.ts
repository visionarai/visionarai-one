import { ORPCError, onError, os, ValidationError } from "@orpc/server";
import {
	CreateNewPolicyInputSchema,
	createPolicyRepository,
	type MasterDataType,
	MasterDataZodSchema,
	PermissionDecisionSchema,
	type PolicyRepository,
	UpdatePolicyInputSchema,
} from "@visionarai-one/abac";
import { createMongoDBConnector } from "@visionarai-one/connectors";
import type { Connection } from "mongoose";
import z from "zod";
import { appLogger } from "@/lib/logger";

const dbProviderMiddleware = os
	.$context<{
		mongooseConnection?: Connection;
		policyRepository?: PolicyRepository;
	}>()
	.middleware(async ({ context, next }) => {
		const databaseConnector = createMongoDBConnector(appLogger, {
			uri: process.env.MONGODB_URI || "mongodb://localhost:27017/visionarai",
		});
		await databaseConnector.connect();

		const mongooseConnection = context.mongooseConnection || databaseConnector.getConnection();
		const policyRepository = context.policyRepository || (await createPolicyRepository(mongooseConnection));

		return next({
			context: {
				mongooseConnection,
				policyRepository,
			},
		});
	});

const dbProcedures = os.use(dbProviderMiddleware).use(
	onError((error) => {
		if (error instanceof ORPCError && error.cause instanceof ValidationError) {
			// If you only use Zod you can safely cast to ZodIssue[]
			const zodError = new z.ZodError(error.cause.issues as z.core.$ZodIssue[]);

			const errorData = {
				cause: error.cause,
				code: error.code,
				data: z.flattenError(zodError),
				message: z.prettifyError(zodError),
			};

			if (error.code === "BAD_REQUEST") {
				throw new ORPCError("INPUT_VALIDATION_FAILED", { ...errorData, status: 422 });
			}
			if (error.code === "INTERNAL_SERVER_ERROR") {
				const message = z.prettifyError(zodError).replace("input", "output");
				throw new ORPCError("OUTPUT_VALIDATION_FAILED", {
					...errorData,
					message,
					status: 500,
				});
			}
		}
	})
);

const masterData: MasterDataType = {
	_id: "64b8f3f4f1d2c4a5b6c7d8e9",
	createdAt: new Date("2024-07-20T10:00:00Z"),
	resources: [
		{
			attributes: [
				{ key: "department", type: "string" },
				{ key: "createdAt", type: "Date" },
			],
			name: "documents",
			permissions: ["read", "write"],
		},
		{
			attributes: [
				{ key: "role", type: "string" },
				{ key: "isActive", type: "boolean" },
			],
			name: "users",
			permissions: ["view", "edit", "delete"],
		},
	],
	updatedAt: new Date("2024-07-20T10:00:00Z"),
	updatedBy: "adminUserId",
};

const getMasterData = dbProcedures.output(MasterDataZodSchema).handler(({ context }) => {
	const { policyRepository } = context;

	const data = policyRepository.masterDataRetrieve();
	if (!data) {
		return masterData;
	}
	return data;
});

const updateMasterData = dbProcedures
	.input(MasterDataZodSchema)
	.output(MasterDataZodSchema)
	.handler(async ({ context, input }) => {
		const { policyRepository } = context;
		await policyRepository.masterDataModify(input);
		const updatedData = policyRepository.masterDataRetrieve();
		if (!updatedData) {
			throw new Error("Failed to update master data");
		}
		return updatedData;
	});

const masterDataResourcesAndEnvironmentAttributes = dbProcedures.handler(({ context }) => {
	const { policyRepository } = context;
	const data = policyRepository.masterDataResourcesAndEnvironmentAttributes();
	if (!data) {
		return { environmentAttributes: [], resources: [] };
	}
	return data;
});

const createPlaceholderPolicy = dbProcedures.input(CreateNewPolicyInputSchema).handler(async ({ context, input }) => {
	const { policyRepository } = context;
	return await policyRepository.policyRegisterNew(input);
});

const getAllPolicies = dbProcedures.handler(async ({ context }) => {
	const { policyRepository } = context;
	return await policyRepository.policiesListAll();
});

const removePolicyById = dbProcedures.input(z.string().min(1)).handler(async ({ context, input }) => {
	const { policyRepository } = context;
	return await policyRepository.policyRemoveById(input);
});

const duplicatedPolicyById = dbProcedures.input(z.string().min(1)).handler(async ({ context, input }) => {
	const { policyRepository } = context;
	return await policyRepository.policyDuplicateById(input);
});

const updatePolicyById = dbProcedures
	.input(z.object({ policyId: z.string().min(1), updatedFields: UpdatePolicyInputSchema }))
	.handler(async ({ context, input }) => {
		const { policyRepository } = context;
		return await policyRepository.policyUpdateById(input.policyId, input.updatedFields);
	});

const updatePermissionsForPolicy = dbProcedures
	.input(z.object({ action: z.string().min(1), permissions: PermissionDecisionSchema, policyId: z.string().min(1), resource: z.string().min(1) }))
	.handler(async ({ context, input }) => {
		const { policyRepository } = context;
		return await policyRepository.policyUpdatePermissionForResourceAction(input.policyId, input.resource, input.action, input.permissions);
	});
export const appRouter = {
	masterData: {
		get: getMasterData,
		resourcesAndEnvironmentAttributes: masterDataResourcesAndEnvironmentAttributes,
		update: updateMasterData,
	},
	policies: {
		createPlaceholderPolicy,
		duplicateById: duplicatedPolicyById,
		getAll: getAllPolicies,
		removeById: removePolicyById,
		updateById: updatePolicyById,
		updatePermissionsForResourceAction: updatePermissionsForPolicy,
	},
};

export type AppRouter = typeof appRouter;
