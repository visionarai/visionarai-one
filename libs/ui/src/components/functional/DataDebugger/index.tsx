"use client";

import type { CSSProperties, MouseEvent, ReactNode, TouchEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RawView } from "./components/raw-view";
import { ResizeGrip } from "./components/resize-grip";
import { ToggleButton } from "./components/toggle-button";
import { useDrag } from "./hooks/use-drag";
import { useResize } from "./hooks/use-resize";
import { safeStringify } from "./utils/json-highlighting";

type Placement = "bottom-right" | "bottom-left" | "top-right" | "top-left";

export type DataDebuggerProps = {
	data: unknown;
	placement?: Placement;
	initialOpen?: boolean;
	className?: string;
	children?: ReactNode;
};

const placementToStyle: Record<Placement, CSSProperties> = {
	"bottom-left": { bottom: 24, left: 24 },
	"bottom-right": { bottom: 24, right: 24 },
	"top-left": { left: 24, top: 24 },
	"top-right": { right: 24, top: 24 },
};

/**
 * Floating, draggable + resizable panel to introspect arbitrary runtime data.
 * Intentionally client-only; keep logic self‑contained and side‑effect free
 * beyond transient DOM event listeners for drag / resize interactions.
 */
export function DataDebugger({ data, placement = "top-right", initialOpen = false, className, children }: DataDebuggerProps) {
	const [open, setOpen] = useState(initialOpen);
	// Minimal mode: raw JSON view only, with wrapping enabled by default
	const wrap = true;

	const panelRef = useRef<HTMLDivElement>(null);

	// Custom hooks for drag and resize functionality
	const { position, isDragging, dragProps, setupDragListeners } = useDrag();
	const { size, isResizing, resizeProps, setupResizeListeners } = useResize();

	// Memoize potentially expensive stringify to avoid recomputing on unrelated state changes.
	const json = useMemo(() => safeStringify(data), [data]);

	// Keyboard shortcut: Ctrl+Shift+D to toggle
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "d") {
				e.preventDefault();
				setOpen((v) => !v);
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, []);

	// Set up drag listeners
	useEffect(() => {
		if (!isDragging) {
			return;
		}
		return setupDragListeners();
	}, [isDragging, setupDragListeners]);

	// Set up resize listeners
	useEffect(() => {
		if (!isResizing) {
			return;
		}
		return setupResizeListeners();
	}, [isResizing, setupResizeListeners]);

	// Copy to clipboard
	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(json).catch(() => {
			/* noop: ignore clipboard errors */
		});
	}, [json]);

	// Panel style
	const style: CSSProperties = {
		...placementToStyle[placement],
		boxShadow: "0 4px 32px 0 rgb(0 0 0 / 0.18)",
		height: size.height,
		position: "fixed",
		transform: `translate(${position.x}px,${position.y}px)`,
		width: size.width,
		zIndex: 1000,
	};

	// Wrapper functions to handle both mouse and touch events
	// Drag handled via dedicated button in header using dragProps

	const handleResizeStart = useCallback(
		(e: MouseEvent | TouchEvent) => {
			if ("touches" in e) {
				resizeProps.onTouchStart(e);
			} else {
				resizeProps.onMouseDown(e as MouseEvent);
			}
		},
		[resizeProps]
	);

	// Toggle button (floating pill)
	if (!open) {
		return <ToggleButton className={className} onClick={() => setOpen(true)} placement={placement} />;
	}

	return (
		<div
			aria-label="Data Debugger Panel"
			className={`fixed z-1000 flex select-none flex-col overflow-hidden rounded-md border border-border bg-[#1e1f22] text-[13px] shadow-lg transition-all ${className || ""}`}
			ref={panelRef}
			role="dialog"
			style={style}
			tabIndex={-1}
		>
			{/* Minimal header with drag handle + actions */}
			<div
				aria-label="Debugger controls"
				className="flex h-8 items-center justify-between gap-2 border-border border-b bg-[#17181a] px-2 text-slate-300"
				role="toolbar"
			>
				<button
					aria-label="Drag debugger"
					className="flex cursor-move items-center gap-2 rounded px-1 py-1 hover:bg-[#1f2023]"
					onMouseDown={dragProps.onMouseDown}
					onTouchStart={dragProps.onTouchStart}
					title="Drag"
					type="button"
				>
					<span aria-hidden="true" className="inline-block h-3 w-3 rounded-full bg-[#2a2b2e]" />
					<span className="text-[12px] text-slate-400">Debug</span>
				</button>
				<div className="flex items-center gap-1">
					<button
						aria-label="Copy JSON"
						className="rounded px-2 py-1 text-[12px] text-slate-300 hover:bg-[#1f2023] hover:text-white active:bg-[#242528]"
						onClick={handleCopy}
						title="Copy"
						type="button"
					>
						Copy
					</button>
					<button
						aria-label="Close debugger"
						className="rounded px-2 py-1 text-[12px] text-slate-300 hover:bg-[#1f2023] hover:text-white active:bg-[#242528]"
						onClick={() => setOpen(false)}
						title="Close"
						type="button"
					>
						×
					</button>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 select-text overflow-auto bg-[#1e1f22] p-2 font-mono text-slate-200 text-xs">
				<RawView json={json} wrap={wrap} />
				{children}
			</div>

			<ResizeGrip onResizeStart={handleResizeStart} />
		</div>
	);
}
