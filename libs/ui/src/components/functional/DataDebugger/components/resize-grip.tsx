import type { MouseEvent, TouchEvent } from "react";

export type ResizeGripProps = {
	onResizeStart: (e: MouseEvent | TouchEvent) => void;
};

export const ResizeGrip = ({ onResizeStart }: ResizeGripProps) => (
	<button
		aria-label="Resize Data Debugger"
		className="absolute right-0 bottom-0 z-10 flex h-5 w-5 cursor-nwse-resize items-end justify-end"
		onMouseDown={onResizeStart}
		onTouchStart={onResizeStart}
		style={{ userSelect: "none" }}
		tabIndex={0}
		type="button"
	>
		<svg aria-hidden="true" className="text-muted-foreground opacity-60" fill="none" height="20" viewBox="0 0 20 20" width="20">
			<title>Resize</title>
			<path d="M4 16h12M8 20h8M12 12h4" stroke="currentColor" strokeWidth="1.2" />
		</svg>
	</button>
);
