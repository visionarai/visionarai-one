import { os } from "@orpc/server";
import { createPolicyRepository, type MasterDataType, MasterDataZodSchema, type PolicyRepository } from "@visionarai-one/abac";
import { createMongoDBConnector } from "@visionarai-one/connectors";
import type { Connection } from "mongoose";
import { pino } from "pino";

const logger = pino({ name: "orpc-server" });

const dbProviderMiddleware = os
	.$context<{
		mongooseConnection?: Connection;
		policyRepository?: PolicyRepository;
	}>()
	.middleware(async ({ context, next }) => {
		const databaseConnector = createMongoDBConnector(logger, {
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

const dbProcedures = os.use(dbProviderMiddleware);

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
};

const getMasterData = dbProcedures.output(MasterDataZodSchema).handler(({ context }) => {
	const { policyRepository } = context;
	const data = policyRepository.recentMasterData();
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
		await policyRepository.updateMasterData(input.resources);
		const updatedData = policyRepository.recentMasterData();
		if (!updatedData) {
			throw new Error("Failed to update master data");
		}
		return updatedData;
	});

export const appRouter = {
	masterData: {
		get: getMasterData,
		update: updateMasterData,
	},
};

export type AppRouter = typeof appRouter;
