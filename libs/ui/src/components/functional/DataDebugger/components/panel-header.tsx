import { Button } from "@visionarai-one/ui";
import type { MouseEvent, TouchEvent } from "react";

export type ViewMode = "raw" | "tree";

export type PanelHeaderProps = {
	view: ViewMode;
	wrap: boolean;
	isDragging: boolean;
	onViewChange: (view: ViewMode) => void;
	onWrapToggle: () => void;
	onCopy: () => void;
	onClose: () => void;
	onDragStart: (e: MouseEvent | TouchEvent) => void;
};

export const PanelHeader = ({ view, wrap, isDragging, onViewChange, onWrapToggle, onCopy, onClose, onDragStart }: PanelHeaderProps) => {
	return (
		<div className="flex items-center justify-between gap-2 border-border border-b bg-gradient-to-r from-[#2d2f33] to-[#232427] px-2 py-1.5">
			<button
				aria-label="Drag Data Debugger"
				className={`cursor-move select-none rounded px-1 py-0.5 font-medium text-[11px] text-slate-300 tracking-wide ${isDragging ? "opacity-70" : ""}`}
				onMouseDown={onDragStart}
				onTouchStart={onDragStart}
				type="button"
			>
				Runtime Data
			</button>
			<div className="flex items-center gap-0.5" style={{ pointerEvents: "auto" }}>
				{/* View tabs */}
				<div className="mr-2 flex overflow-hidden rounded border border-border">
					<button
						className={`px-2 py-0.5 text-[11px] leading-none ${view === "raw" ? "bg-[#3a3d41] text-slate-100" : "text-slate-400 hover:text-slate-200"}`}
						onClick={() => onViewChange("raw")}
						type="button"
					>
						Raw
					</button>
					<button
						className={`px-2 py-0.5 text-[11px] leading-none ${view === "tree" ? "bg-[#3a3d41] text-slate-100" : "text-slate-400 hover:text-slate-200"}`}
						onClick={() => onViewChange("tree")}
						type="button"
					>
						Tree
					</button>
				</div>
				<button
					aria-label="Toggle Wrap"
					className={`rounded px-1.5 py-0.5 text-[11px] ${wrap ? "bg-[#3a3d41] text-slate-100" : "text-slate-400 hover:text-slate-200"}`}
					onClick={onWrapToggle}
					type="button"
				>
					Wrap
				</button>
				<Button aria-label="Copy JSON" className="text-[11px]" onClick={onCopy} size="icon" variant="ghost">
					<svg aria-hidden="true" className="inline" fill="none" height="16" viewBox="0 0 16 16" width="16">
						<title>Copy</title>
						<path
							d="M5.5 2.5A1.5 1.5 0 0 1 7 1h5a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 12 12H7a1.5 1.5 0 0 1-1.5-1.5v-8ZM3 4.5v8A1.5 1.5 0 0 0 4.5 14h5"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="1.2"
						/>
					</svg>
				</Button>
				<Button aria-label="Close" className="text-[11px]" onClick={onClose} size="icon" variant="ghost">
					<svg aria-hidden="true" className="inline" fill="none" height="16" viewBox="0 0 16 16" width="16">
						<title>Close</title>
						<path d="m5.5 5.5 5 5m0-5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
					</svg>
				</Button>
			</div>
		</div>
	);
};
