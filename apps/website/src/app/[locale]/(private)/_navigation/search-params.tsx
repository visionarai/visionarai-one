import { createLoader, parseAsBoolean } from "nuqs/server";

export const searchParamParsers = {
	sidebarOpen: parseAsBoolean.withDefault(true),
};

export const loadSearchParams = createLoader(searchParamParsers);
