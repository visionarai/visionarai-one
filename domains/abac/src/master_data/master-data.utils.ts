import type { ResourceType } from "./master-data.zod";

export const resourceDataFromMasterData = (resources: ResourceType[]) =>
	resources.reduce(
		(acc, resource) => {
			acc[resource.name] = {
				attributes: resource.attributes || [],
				permissions: resource.permissions || [],
			};
			return acc;
		},
		{} as Record<string, Omit<ResourceType, "name">>
	);
