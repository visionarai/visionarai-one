import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { onError } from "@orpc/server";
import type { AppRouter } from "@/router";

declare global {
	var $client: RouterClient<AppRouter> | undefined;
}

const link = new RPCLink({
	headers: async () => {
		if (typeof window !== "undefined") {
			return {};
		}

		const { headers } = await import("next/headers");
		return await headers();
	},
	interceptors: [
		onError((error) => {
			// biome-ignore lint/suspicious/noConsole: Debugging
			console.error(error);
		}),
	],
	url: () => {
		if (typeof window === "undefined") {
			throw new Error("RPCLink is not allowed on the server side.");
		}

		return `${window.location.origin}/rpc`;
	},
});

/**
 * Fallback to client-side client if server-side client is not available.
 */
export const orpcRouterClient: RouterClient<AppRouter> = globalThis.$client ?? createORPCClient(link);
