import { isAccessControlDomain } from '@visionarai-one/access-control';

export function GET(request: Request) {
  const data = isAccessControlDomain();
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      request: request.url,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
