"use client";

import type { CSSProperties, MouseEvent, ReactNode, TouchEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PanelHeader } from "./components/panel-header";
import { RawView } from "./components/raw-view";
import { ResizeGrip } from "./components/resize-grip";
import { ToggleButton } from "./components/toggle-button";
import { TreeView } from "./components/tree-view";
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
export function DataDebugger({ data, placement = "bottom-left", initialOpen = false, className, children }: DataDebuggerProps) {
	const [open, setOpen] = useState(initialOpen);
	const [view, setView] = useState<"raw" | "tree">("raw");
	const [wrap, setWrap] = useState(true);

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
	const handleDragStart = useCallback(
		(e: MouseEvent | TouchEvent) => {
			if ("clientX" in e) {
				dragProps.onMouseDown(e as MouseEvent);
			}
		},
		[dragProps]
	);

	const handleResizeStart = useCallback(
		(e: MouseEvent | TouchEvent) => {
			if ("clientX" in e) {
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
			className={`fixed z-1000 flex select-none flex-col overflow-hidden rounded-md border border-border bg-[#1e1f22] text-[13px] shadow-2xl transition-all ${className || ""}`}
			ref={panelRef}
			role="dialog"
			style={style}
			tabIndex={-1}
		>
			<PanelHeader
				isDragging={isDragging}
				onClose={() => setOpen(false)}
				onCopy={handleCopy}
				onDragStart={handleDragStart}
				onViewChange={setView}
				onWrapToggle={() => setWrap((w) => !w)}
				view={view}
				wrap={wrap}
			/>

			{/* Content */}
			<div className="flex-1 select-text overflow-auto bg-[#1e1f22] p-2 font-mono text-slate-200 text-xs">
				{view === "raw" ? <RawView json={json} wrap={wrap} /> : <TreeView data={data} />}
				{children}
			</div>

			<ResizeGrip onResizeStart={handleResizeStart} />
		</div>
	);
}
