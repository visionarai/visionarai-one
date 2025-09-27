import { z } from "zod";

export const ATTRIBUTE_TYPES = ["string", "number", "boolean", "Date"] as const;

export const ResourceZodSchema = z.object({
	attributes: z
		.array(
			z.object({
				key: z.string(),
				type: z.enum(ATTRIBUTE_TYPES),
			})
		)
		.optional(),
	name: z.string(),
	permissions: z.array(z.string()).optional(),
});

export const EnvironmentAttributeZodSchema = z.object({
	key: z.string(),
	type: z.enum(ATTRIBUTE_TYPES),
});

export const MasterDataZodSchema = z.object({
	_id: z.string(),
	createdAt: z.date(),
	environmentAttributes: z.array(EnvironmentAttributeZodSchema).optional(),
	resources: ResourceZodSchema.array(),
	updatedAt: z.date(),
	updatedBy: z.string(),
	version: z.number().int().nonnegative().optional(),
});

export type ResourceType = z.infer<typeof ResourceZodSchema>;
export type EnvironmentAttributeType = z.infer<typeof EnvironmentAttributeZodSchema>;
export type MasterDataType = z.infer<typeof MasterDataZodSchema>;
export type AttributeType = (typeof ATTRIBUTE_TYPES)[number];
