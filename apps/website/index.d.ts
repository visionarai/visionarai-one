import type { JSX } from 'react';

declare module '*.svg' {
	const content: string;
	export const ReactComponent: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
	export default content;
}
