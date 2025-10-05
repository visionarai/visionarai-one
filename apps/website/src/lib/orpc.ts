import { createORPCClient, createSafeClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { AppRouter } from "@/router";

// import { runtimeConfig } from "./runtime-conf";

const link = new RPCLink({
	headers: async () => {
		if (typeof window !== "undefined") {
			return {};
		}

		const { headers } = await import("next/headers");
		return await headers();
	},
	url: async () => {
		if (typeof window !== "undefined") {
			return `${window.location.origin}/rpc`;
		}
		const { runtimeConfig } = (await import("./runtime-conf")) as unknown as { runtimeConfig: { orpcUrl: string } };
		return runtimeConfig.orpcUrl;
	},
});

/**
 * Fallback to client-side client if server-side client is not available.
 */
export const orpcClient: RouterClient<AppRouter> = createORPCClient(link);

export const safeOrpcClient = createSafeClient(orpcClient);
