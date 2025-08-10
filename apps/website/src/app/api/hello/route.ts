import { isAccessControlDomain } from '@visionarai-one/access-control';

export function GET(request: Request) {
	const data = isAccessControlDomain();
	return new Response(JSON.stringify(data, null, 2), {
		headers: {
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Origin': '*',
			'Cache-Control': 'no-store',
			'Content-Type': 'application/json',
			request: request.url,
		},
	});
}
