import { accessControl } from '@visionarai-one/access-control';

export async function GET(request: Request) {
  accessControl();
  return new Response('Hello, from API!');
}
