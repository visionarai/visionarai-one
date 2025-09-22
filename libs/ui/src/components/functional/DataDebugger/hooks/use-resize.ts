import type { MouseEvent, TouchEvent } from "react";
import { useCallback, useRef, useState } from "react";

export type UseResizeOptions = {
	initialSize?: { width: number; height: number };
	minWidth?: number;
	minHeight?: number;
};

export type UseResizeReturn = {
	size: { width: number; height: number };
	isResizing: boolean;
	resizeProps: {
		onMouseDown: (e: MouseEvent) => void;
		onTouchStart: (e: TouchEvent) => void;
	};
	setupResizeListeners: () => () => void;
};

const PANEL_MIN_WIDTH = 320;
const PANEL_MIN_HEIGHT = 380;

const getClientPoint = (e: MouseEvent | TouchEvent) => ("touches" in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY });

export const useResize = (options: UseResizeOptions = {}): UseResizeReturn => {
	const { initialSize = { height: 500, width: 500 }, minWidth = PANEL_MIN_WIDTH, minHeight = PANEL_MIN_HEIGHT } = options;

	const [size, setSize] = useState(initialSize);
	const [isResizing, setIsResizing] = useState(false);
	const dragStart = useRef({ x: 0, y: 0 });
	const sizeStart = useRef(initialSize);

	const disableUserSelect = useCallback(() => {
		document.body.style.userSelect = "none";
	}, []);

	const restoreUserSelect = useCallback(() => {
		document.body.style.userSelect = "";
	}, []);

	const onResizeStart = useCallback(
		(e: MouseEvent | TouchEvent) => {
			setIsResizing(true);
			const { x, y } = getClientPoint(e);
			dragStart.current = { x, y };
			sizeStart.current = { ...size };
			e.stopPropagation();
			disableUserSelect();
		},
		[size, disableUserSelect]
	);

	const onResize = useCallback(
		(e: MouseEvent | TouchEvent) => {
			if (!isResizing) {
				return;
			}
			const { x: clientX, y: clientY } = getClientPoint(e);
			setSize((prev) => {
				const nextWidth = Math.max(minWidth, sizeStart.current.width + (clientX - dragStart.current.x));
				const nextHeight = Math.max(minHeight, sizeStart.current.height + (clientY - dragStart.current.y));
				return prev.width === nextWidth && prev.height === nextHeight ? prev : { height: nextHeight, width: nextWidth };
			});
		},
		[isResizing, minWidth, minHeight]
	);

	// Set up global listeners for resize
	const setupResizeListeners = useCallback(() => {
		const mouseMove: EventListener = (e) => onResize(e as unknown as MouseEvent);
		const touchMove: EventListener = (e) => onResize(e as unknown as TouchEvent);
		const up = () => {
			setIsResizing(false);
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
	}, [onResize, restoreUserSelect]);

	return {
		isResizing,
		resizeProps: {
			onMouseDown: onResizeStart,
			onTouchStart: onResizeStart,
		},
		setupResizeListeners,
		size,
	} as UseResizeReturn & { setupResizeListeners: () => () => void };
};
