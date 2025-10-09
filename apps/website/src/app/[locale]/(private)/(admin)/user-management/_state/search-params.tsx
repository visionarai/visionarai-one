import { createSerializer, parseAsBoolean, parseAsJson, parseAsString, parseAsStringEnum } from "nuqs/server";
import { z } from "zod";

const querySchema = z.object({
	filterField: z.string().optional(),
	filterOperator: z.enum(["eq", "ne", "lt", "lte", "gt", "gte", "contains"]).optional(),
	filterValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	searchField: z.enum(["email", "name"]).optional(),
	searchOperator: z.enum(["contains", "starts_with", "ends_with"]).optional(),
	searchValue: z.string().optional(),
	sortBy: z.string().optional(),
	sortDirection: z.enum(["asc", "desc"]).optional(),
});

export type QueryType = z.infer<typeof querySchema>;

export const querySearchParams = {
	openUserProfile: parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true, shallow: true }),
	query: parseAsJson(querySchema).withOptions({ clearOnDefault: true, shallow: true }).withDefault({ limit: 10, offset: 0 }),
	selectedUserId: parseAsString.withOptions({ clearOnDefault: true, shallow: true }),
	selectSearchField: parseAsStringEnum(["email", "name"] as const)
		.withDefault("email")
		.withOptions({ clearOnDefault: true, shallow: true }),
};

export const serialize = createSerializer(querySearchParams);

export const serializeUrl = (query: QueryType, upsert: QueryType) =>
	`/user-management${serialize({
		query: {
			...query,
			...upsert,
		},
	})}`;
