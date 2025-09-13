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

export const MasterDataZodSchema = z.object({
	_id: z.string(),
	createdAt: z.date(),
	resources: ResourceZodSchema.array().optional(),
	updatedAt: z.date(),
});

export type ResourceType = z.infer<typeof ResourceZodSchema>;
export type MasterDataType = z.infer<typeof MasterDataZodSchema>;
export type AttributeType = (typeof ATTRIBUTE_TYPES)[number];
