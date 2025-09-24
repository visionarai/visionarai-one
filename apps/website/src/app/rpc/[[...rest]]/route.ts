import { RPCHandler } from "@orpc/server/fetch";
import { BatchHandlerPlugin } from "@orpc/server/plugins";
import { appRouter } from "@/router";

const rpcHandler = new RPCHandler(appRouter, {
	plugins: [new BatchHandlerPlugin()],
});

async function handleRequest(request: Request) {
	const { response } = await rpcHandler.handle(request, {
		context: {},
		prefix: "/rpc",
	});

	return response ?? new Response("Not found", { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
