import type { MouseEvent, TouchEvent } from "react";
import { useCallback, useRef, useState } from "react";

export type UseDragOptions = {
	initialPosition?: { x: number; y: number };
};

export type UseDragReturn = {
	position: { x: number; y: number };
	isDragging: boolean;
	dragProps: {
		onMouseDown: (e: MouseEvent) => void;
		onTouchStart: (e: TouchEvent) => void;
	};
	setupDragListeners: () => () => void;
};

const getClientPoint = (e: MouseEvent | TouchEvent) => ("touches" in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY });

export const useDrag = (options: UseDragOptions = {}): UseDragReturn => {
	const { initialPosition = { x: 0, y: 0 } } = options;
	const [position, setPosition] = useState(initialPosition);
	const [isDragging, setIsDragging] = useState(false);
	const dragStart = useRef({ x: 0, y: 0 });
	const posStart = useRef(initialPosition);

	const disableUserSelect = useCallback(() => {
		document.body.style.userSelect = "none";
	}, []);

	const restoreUserSelect = useCallback(() => {
		document.body.style.userSelect = "";
	}, []);

	const onDragStart = useCallback(
		(e: MouseEvent | TouchEvent) => {
			setIsDragging(true);
			const { x, y } = getClientPoint(e);
			dragStart.current = { x, y };
			posStart.current = { ...position };
			disableUserSelect();
		},
		[position, disableUserSelect]
	);

	const onDrag = useCallback(
		(e: MouseEvent | TouchEvent) => {
			if (!isDragging) {
				return;
			}
			const { x: clientX, y: clientY } = getClientPoint(e);
			setPosition({
				x: posStart.current.x + (clientX - dragStart.current.x),
				y: posStart.current.y + (clientY - dragStart.current.y),
			});
		},
		[isDragging]
	);

	// Set up global listeners for drag
	const setupDragListeners = useCallback(() => {
		const mouseMove: EventListener = (e) => onDrag(e as unknown as MouseEvent);
		const touchMove: EventListener = (e) => onDrag(e as unknown as TouchEvent);
		const up = () => {
			setIsDragging(false);
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
	}, [onDrag, restoreUserSelect]);

	return {
		dragProps: {
			onMouseDown: onDragStart,
			onTouchStart: onDragStart,
		},
		isDragging,
		position,
		setupDragListeners,
	} as UseDragReturn & { setupDragListeners: () => () => void };
};
