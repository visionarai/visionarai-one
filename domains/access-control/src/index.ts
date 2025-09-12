import { type Connection, type Model, models } from "mongoose";
import { AppError } from "./error/index.js";
import { MasterDataSchema, type MasterDataType } from "./master_data/index.js";
import {
	type EvaluationContext,
	type NormalizedPolicy,
	PersistedPolicySchema,
	type PolicyDocument,
	type PolicyModelType,
	PolicySchema,
} from "./policy/index.js";

export * from "./master_data/index.js";
export * from "./policy/index.js";

export function isAccessControlDomain(): boolean {
	return true;
}

export const createPolicyRepository = (mongooseConnection: Connection) => {
	const PolicyModel =
		(models.Policy as Model<PolicyDocument, PolicyModelType>) || mongooseConnection.model<PolicyDocument, PolicyModelType>("Policy", PolicySchema);
	const MasterDataModel: Model<MasterDataType> = models.MasterData || mongooseConnection.model<MasterDataType>("MasterData", MasterDataSchema);

	let recentMasterData: MasterDataType["resources"] | null = null;
	let allowedResourceTypes: string[] = [];
	const ensureMasterDataLoaded = async () => {
		if (recentMasterData) {
			return;
		}
		const masterData = await MasterDataModel.findOne().sort({ createdAt: -1 }).exec();
		if (!masterData?.resources) {
			throw new AppError("MASTER_DATA_NOT_FOUND", {
				context: { location: "createPolicyRepository.ensureMasterDataLoaded" },
			});
		}
		recentMasterData = masterData.resources;
		allowedResourceTypes = Object.keys(recentMasterData);
	};

	// Warm cache (ignore errors here; first guarded call will surface them)
	ensureMasterDataLoaded().catch(() => {
		// cache warm failure is non-fatal; first guarded call will surface error
	});

	return {
		async applyPatch(policyId: string, patch: { expectedVersion: number; mutate: (current: NormalizedPolicy) => NormalizedPolicy }) {
			const existing = await PolicyModel.findById(policyId).exec();
			if (!existing) {
				throw new AppError("POLICY_NOT_FOUND", { context: { location: "createPolicyRepository.applyPatch", policyId } });
			}
			const current = existing.toObject() as NormalizedPolicy;
			if (current.version !== patch.expectedVersion) {
				throw new AppError("POLICY_CREATION_FAILED", {
					// reuse existing code; semantic: write failure
					context: { actual: current.version, expected: patch.expectedVersion, location: "createPolicyRepository.applyPatch", policyId },
				});
			}
			const mutated = patch.mutate(current);
			mutated.version = current.version + 1;
			mutated.updatedAt = new Date();
			const parsed = PersistedPolicySchema.safeParse(mutated);
			if (!parsed.success) {
				throw new AppError("POLICY_CREATION_FAILED", {
					context: { location: "createPolicyRepository.applyPatch", policyId, validation: parsed.error.format() },
				});
			}
			await PolicyModel.updateOne({ _id: policyId, version: current.version }, parsed.data).exec();
			return parsed.data;
		},
		async createPolicy(raw: Omit<NormalizedPolicy, "version" | "createdAt" | "updatedAt">): Promise<PolicyDocument> {
			try {
				const now = new Date();
				const doc: NormalizedPolicy = {
					...raw,
					createdAt: now,
					updatedAt: now,
					version: 0,
				} as NormalizedPolicy;
				const parsed = PersistedPolicySchema.safeParse(doc);
				if (!parsed.success) {
					throw new Error(JSON.stringify(parsed.error.format()));
				}
				const model = new PolicyModel(parsed.data);
				return await model.save();
			} catch (e) {
				throw new AppError("POLICY_CREATION_FAILED", {
					context: { error: String(e), location: "createPolicyRepository.createPolicy" },
				});
			}
		},
		async getPolicyById(id: string) {
			const policy = await PolicyModel.findById(id).exec();
			if (!policy) {
				throw new AppError("POLICY_NOT_FOUND", {
					context: { id, location: "createPolicyRepository.getPolicyById" },
				});
			}
			return {
				isPermissionGranted: async (ctx: EvaluationContext): Promise<boolean> => {
					await ensureMasterDataLoaded();
					if (!allowedResourceTypes.includes(ctx.resourceType)) {
						throw new AppError("RESOURCE_TYPE_NOT_ALLOWED", {
							context: {
								location: "createPolicyRepository.getPolicyById.isPermissionGranted",
								resourceType: ctx.resourceType,
							},
							metadata: { resource: ctx.resourceType },
						});
					}
					return policy.evaluate(ctx);
				},
			};
		},
	};
};
