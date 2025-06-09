import { cn } from '@visionarai-one/utils';
import { Button } from '@visionarai-one/ui';

export default function Index() {
  return (
    <div
      className={cn([
        'flex flex-row',
        'items-center justify-center',
        'h-screen w-screen',
        'bg-gray-900',
      ])}
    >
      <Button variant={'destructive'}>Hello World</Button>
    </div>
  );
}
