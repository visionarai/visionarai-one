import { createORPCClient, createSafeClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { AppRouter } from "@/router";

const AUTH_FALLBACK_URL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

const link = new RPCLink({
	headers: async () => {
		if (typeof window !== "undefined") {
			return {};
		}

		const { headers } = await import("next/headers");
		return await headers();
	},
	url: `${typeof window !== "undefined" ? window.location.origin : AUTH_FALLBACK_URL}/rpc`,
});

/**
 * Fallback to client-side client if server-side client is not available.
 */
export const orpcClient: RouterClient<AppRouter> = createORPCClient(link);

export const safeOrpcClient = createSafeClient(orpcClient);
