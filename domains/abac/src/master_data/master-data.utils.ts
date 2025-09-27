import type { ResourceType } from "src/master_data";

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
