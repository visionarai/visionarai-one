"use client";

import { Button } from "@visionarai-one/ui";
import { cn } from "@visionarai-one/utils";
import type { CSSProperties, MouseEvent, ReactNode, TouchEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Placement = "bottom-right" | "bottom-left" | "top-right" | "top-left";

export type DataDebuggerProps = {
	data: unknown;
	placement?: Placement;
	initialOpen?: boolean;
	className?: string;
	children?: ReactNode;
};

const PANEL_MIN_WIDTH = 320;
const PANEL_MIN_HEIGHT = 180;
const PANEL_DEFAULT_WIDTH = 400;
const PANEL_DEFAULT_HEIGHT = 240;

// Highlighting regex (top-level for perf)
// Tokenization: keys, strings, literals, numbers
const TOKEN_REGEX =
	/("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"\s*:)|("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;
const KEY_RE = /^".*"\s*:$/u;
const BOOL_RE = /^(true|false)$/u;
const NULL_RE = /^null$/u;
const NUM_RE = /^-?\d/;

// Tree helpers & component -----------------------------------------------------
type NodeProps = { value: unknown; name?: string | number; depth?: number };
const INDENT = 12;
const isExpandable = (v: unknown) => v !== null && typeof v === "object" && (Array.isArray(v) ? v.length > 0 : Object.keys(v as object).length > 0);
const previewValue = (v: unknown): string => {
	if (v === null) {
		return "null";
	}
	if (typeof v === "string") {
		return v.length > 32 ? JSON.stringify(`${v.slice(0, 32)}…`) : JSON.stringify(v);
	}
	if (typeof v === "number" || typeof v === "boolean") {
		return String(v);
	}
	if (Array.isArray(v)) {
		return `Array(${v.length})`;
	}
	if (typeof v === "object") {
		return `Object(${Object.keys(v as object).length})`;
	}
	return typeof v;
};

function LeafNode({ value, name, depth }: NodeProps & { depth: number }) {
	const paddingLeft = depth * INDENT;
	return (
		<div className="leading-snug" style={{ paddingLeft }}>
			{name !== undefined && (
				<span className="text-blue-400">
					{typeof name === "number" ? name : JSON.stringify(String(name))}
					<span className="text-foreground">: </span>
				</span>
			)}
			<span
				className={cn(
					typeof value === "string" && "text-green-400",
					typeof value === "number" && "text-orange-400",
					typeof value === "boolean" && "text-purple-400",
					value === null && "text-gray-400 italic"
				)}
			>
				{previewValue(value)}
			</span>
		</div>
	);
}

function BranchNode({ value, name, depth }: NodeProps & { depth: number }) {
	const [collapsed, setCollapsed] = useState(depth > 4);
	const paddingLeft = depth * INDENT;
	const entries = Array.isArray(value) ? (value as unknown[]) : Object.entries(value as Record<string, unknown>);
	const openSymbol = Array.isArray(value) ? "[" : "{";
	const closeSymbol = Array.isArray(value) ? "]" : "}";
	return (
		<div className="leading-snug" style={{ paddingLeft }}>
			<button
				aria-label={collapsed ? "Expand" : "Collapse"}
				className={cn("mr-1 inline-flex h-4 w-4 items-center justify-center rounded border border-border bg-muted text-xs", collapsed && "opacity-70")}
				onClick={() => setCollapsed((c) => !c)}
				type="button"
			>
				{collapsed ? "+" : "−"}
			</button>
			{name !== undefined && (
				<span className="text-blue-400">
					{typeof name === "number" ? name : JSON.stringify(String(name))}
					<span className="text-foreground">: </span>
				</span>
			)}
			<span className="text-gray-400">{openSymbol}</span>
			{collapsed ? (
				<span className="text-gray-400"> … {closeSymbol}</span>
			) : (
				<>
					<div className="mt-1" />
					{entries.map((entry, idx) => {
						const key = Array.isArray(value) ? idx : (entry as [string, unknown])[0];
						const val = Array.isArray(value) ? entry : (entry as [string, unknown])[1];
						return <TreeNode depth={depth + 1} key={key} name={key} value={val} />;
					})}
					<div style={{ paddingLeft: depth * INDENT }}>
						<span className="text-gray-400">{closeSymbol}</span>
					</div>
				</>
			)}
		</div>
	);
}

function TreeNode(props: NodeProps & { depth?: number }) {
	const { value, depth = 0 } = props;
	if (!isExpandable(value)) {
		return <LeafNode {...props} depth={depth} />;
	}
	return <BranchNode {...props} depth={depth} />;
}

function safeStringify(obj: unknown, space = 2): string {
	const seen = new WeakSet();
	return JSON.stringify(
		obj,
		(_key, value) => {
			if (typeof value === "object" && value !== null) {
				if (seen.has(value)) {
					return "[Circular]";
				}
				seen.add(value);
			}
			return value;
		},
		space
	);
}

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
	const [width, setWidth] = useState(PANEL_DEFAULT_WIDTH);
	const [height, setHeight] = useState(PANEL_DEFAULT_HEIGHT);
	const [dragging, setDragging] = useState(false);
	const [resizing, setResizing] = useState(false);
	const [view, setView] = useState<"raw" | "tree">("raw");
	const [wrap, setWrap] = useState(true);
	// Removed unused offset state
	const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
	const panelRef = useRef<HTMLDivElement>(null);
	const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const posStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

	// Memoize potentially expensive stringify to avoid recomputing on unrelated state changes.
	const json = useMemo(() => safeStringify(data), [data]);

	// Lightweight JSON syntax highlighting (reduced complexity)
	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This is just a dev tool
	const highlightedJson = useMemo<ReactNode[]>(() => {
		if (json.length < 160) {
			return [json];
		}
		const out: ReactNode[] = [];
		let last = 0;
		for (const m of json.matchAll(TOKEN_REGEX)) {
			const start = m.index ?? 0;
			if (start > last) {
				out.push(json.slice(last, start));
			}
			const tok = m[0];
			let cls = "text-foreground";
			if (KEY_RE.test(tok)) {
				cls = "text-blue-400"; // key
			} else if (tok.startsWith('"')) {
				cls = "text-green-400"; // string
			} else if (BOOL_RE.test(tok)) {
				cls = "text-purple-400"; // bool
			} else if (NULL_RE.test(tok)) {
				cls = "text-gray-400 italic"; // null
			} else if (NUM_RE.test(tok)) {
				cls = "text-orange-400"; // number
			}
			out.push(
				<span className={cls} key={start}>
					{tok}
				</span>
			);
			last = start + tok.length;
			if (out.length > 3000) {
				break;
			}
		}
		if (last < json.length) {
			out.push(json.slice(last));
		}
		return out;
	}, [json]);

	// Tree view components -------------------------------------------------------

	// --- Helpers ----------------------------------------------------------------
	// Stable utility references (not recreated between renders)
	const getClientPoint = useCallback(
		(e: MouseEvent | TouchEvent) => ("touches" in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY }),
		[]
	);
	const disableUserSelect = useCallback(() => {
		document.body.style.userSelect = "none";
	}, []);
	const restoreUserSelect = useCallback(() => {
		document.body.style.userSelect = "";
	}, []);

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

	// Drag logic
	const onDragStart = useCallback(
		(e: MouseEvent | TouchEvent) => {
			setDragging(true);
			const { x, y } = getClientPoint(e);
			dragStart.current = { x, y };
			posStart.current = { ...position };
			disableUserSelect();
		},
		[position, getClientPoint, disableUserSelect]
	);
	const onDrag = useCallback(
		(e: MouseEvent | TouchEvent) => {
			if (!dragging) {
				return;
			}
			const { x: clientX, y: clientY } = getClientPoint(e);
			setPosition({
				x: posStart.current.x + (clientX - dragStart.current.x),
				y: posStart.current.y + (clientY - dragStart.current.y),
			});
		},
		[dragging, getClientPoint]
	);

	// Resize logic
	const onResizeStart = useCallback(
		(e: MouseEvent | TouchEvent) => {
			setResizing(true);
			const { x, y } = getClientPoint(e);
			dragStart.current = { x, y };
			posStart.current = { x: width, y: height };
			e.stopPropagation();
			disableUserSelect();
		},
		[width, height, getClientPoint, disableUserSelect]
	);
	const onResize = useCallback(
		(e: MouseEvent | TouchEvent) => {
			if (!resizing) {
				return;
			}
			const { x: clientX, y: clientY } = getClientPoint(e);
			setWidth((prev) => {
				const next = Math.max(PANEL_MIN_WIDTH, posStart.current.x + (clientX - dragStart.current.x));
				return prev === next ? prev : next;
			});
			setHeight((prev) => {
				const next = Math.max(PANEL_MIN_HEIGHT, posStart.current.y + (clientY - dragStart.current.y));
				return prev === next ? prev : next;
			});
		},
		[resizing, getClientPoint]
	);

	// Shared global listeners for drag & resize; keep two small effects instead of one big conditional block
	useEffect(() => {
		if (!dragging) {
			return;
		}
		const mouseMove: EventListener = (e) => onDrag(e as unknown as MouseEvent);
		const touchMove: EventListener = (e) => onDrag(e as unknown as TouchEvent);
		const up = () => {
			setDragging(false);
			restoreUserSelect();
		};
		window.addEventListener("mousemove", mouseMove);
		window.addEventListener("touchmove", touchMove);
		window.addEventListener("mouseup", up);
		window.addEventListener("touchend", up);
		return () => {
			window.removeEventListener("mousemove", mouseMove);
			window.removeEventListener("touchmove", touchMove);
			window.removeEventListener("mouseup", up);
			window.removeEventListener("touchend", up);
		};
	}, [dragging, onDrag, restoreUserSelect]);

	useEffect(() => {
		if (!resizing) {
			return;
		}
		const mouseMove: EventListener = (e) => onResize(e as unknown as MouseEvent);
		const touchMove: EventListener = (e) => onResize(e as unknown as TouchEvent);
		const up = () => {
			setResizing(false);
			restoreUserSelect();
		};
		window.addEventListener("mousemove", mouseMove);
		window.addEventListener("touchmove", touchMove);
		window.addEventListener("mouseup", up);
		window.addEventListener("touchend", up);
		return () => {
			window.removeEventListener("mousemove", mouseMove);
			window.removeEventListener("touchmove", touchMove);
			window.removeEventListener("mouseup", up);
			window.removeEventListener("touchend", up);
		};
	}, [resizing, onResize, restoreUserSelect]);

	// Copy to clipboard
	const handleCopy = useCallback(() => {
		// Use memoized json to avoid extra stringify
		navigator.clipboard.writeText(json).catch(() => {
			/* noop: ignore clipboard errors */
		});
	}, [json]);

	// Panel style
	const style: CSSProperties = {
		...placementToStyle[placement],
		boxShadow: "0 4px 32px 0 rgb(0 0 0 / 0.18)",
		height,
		position: "fixed",
		transform: `translate(${position.x}px,${position.y}px)`,
		width,
		zIndex: 1000,
	};

	// Toggle button (floating pill)
	if (!open) {
		return (
			<Button
				aria-label="Open Data Debugger"
				className={cn(
					"fixed h-6 w-32 bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 font-medium text-white text-xs shadow-lg ring-1 ring-white/10 ring-inset transition-all",
					className
				)}
				onClick={() => setOpen(true)}
				style={placementToStyle[placement]}
				type="button"
			>
				DevTools
			</Button>
		);
	}

	return (
		<div
			aria-label="Data Debugger Panel"
			className={cn(
				"fixed z-1000 flex select-none flex-col overflow-hidden rounded-md border border-border bg-[#1e1f22] text-[13px] shadow-2xl transition-all",
				className
			)}
			ref={panelRef}
			role="dialog"
			style={style}
			tabIndex={-1}
		>
			{/* Header -------------------------------------------------------------- */}
			<div className="flex items-center justify-between gap-2 border-border border-b bg-gradient-to-r from-[#2d2f33] to-[#232427] px-2 py-1.5">
				<button
					aria-label="Drag Data Debugger"
					className={cn("cursor-move select-none rounded px-1 py-0.5 font-medium text-[11px] text-slate-300 tracking-wide", dragging && "opacity-70")}
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
							className={cn("px-2 py-0.5 text-[11px] leading-none", view === "raw" ? "bg-[#3a3d41] text-slate-100" : "text-slate-400 hover:text-slate-200")}
							onClick={() => setView("raw")}
							type="button"
						>
							Raw
						</button>
						<button
							className={cn("px-2 py-0.5 text-[11px] leading-none", view === "tree" ? "bg-[#3a3d41] text-slate-100" : "text-slate-400 hover:text-slate-200")}
							onClick={() => setView("tree")}
							type="button"
						>
							Tree
						</button>
					</div>
					<button
						aria-label="Toggle Wrap"
						className={cn("rounded px-1.5 py-0.5 text-[11px]", wrap ? "bg-[#3a3d41] text-slate-100" : "text-slate-400 hover:text-slate-200")}
						onClick={() => setWrap((w) => !w)}
						type="button"
					>
						Wrap
					</button>
					<Button aria-label="Copy JSON" className="text-[11px]" onClick={handleCopy} size="icon" variant="ghost">
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
					<Button aria-label="Close" className="text-[11px]" onClick={() => setOpen(false)} size="icon" variant="ghost">
						<svg aria-hidden="true" className="inline" fill="none" height="16" viewBox="0 0 16 16" width="16">
							<title>Close</title>
							<path d="m5.5 5.5 5 5m0-5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
						</svg>
					</Button>
				</div>
			</div>
			{/* Content ------------------------------------------------------------- */}
			<div className="flex-1 select-text overflow-auto bg-[#1e1f22] p-2 font-mono text-slate-200 text-xs">
				{view === "raw" ? (
					<pre className={cn("leading-snug", wrap ? "whitespace-pre-wrap break-all" : "whitespace-pre")}>{highlightedJson}</pre>
				) : (
					<div className={cn("space-y-0.5", wrap ? "" : "")}>
						<TreeNode value={data} />
					</div>
				)}
				{children}
			</div>
			{/* Resize grip: use button for accessibility */}
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
		</div>
	);
}
