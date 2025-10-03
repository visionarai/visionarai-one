"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";

type TheyEyeOfVisionProps = {
	size?: number;
	className?: string;
	followCursor?: boolean;
};

const TheyEyeOfVisionComponent = ({ size = 150, className = "", followCursor = true }: TheyEyeOfVisionProps) => {
	const eyeRef = useRef<HTMLDivElement>(null);

	// memoize derived sizes to avoid recomputing on every render
	const outerCircleSize = useMemo(() => size, [size]);
	const eyeballSize = useMemo(() => outerCircleSize * 0.7, [outerCircleSize]); // 70% of outer circle
	const pupilSize = useMemo(() => outerCircleSize * 0.32, [outerCircleSize]); // 32% of outer circle
	const defaultPupilOffset = useMemo(() => size * 0.2, [size]); // 20% of eye size for default offset
	const mainBorderWidth = useMemo(() => size * 0.035, [size]); // 3.5% of eye size for main border width

	const [pupilPosition, setPupilPosition] = useState(() => ({ x: -defaultPupilOffset, y: -defaultPupilOffset }));

	useEffect(() => {
		// If not following cursor, ensure pupil is at the static default position but avoid unnecessary state updates
		if (!followCursor) {
			setPupilPosition((prev) => {
				const desired = { x: -defaultPupilOffset, y: -defaultPupilOffset };
				if (prev.x === desired.x && prev.y === desired.y) return prev;
				return desired;
			});

			return;
		}

		// Only create the handler when following the cursor to avoid doing any DOM/math work otherwise
		const handleMouseMove = (e: MouseEvent) => {
			const el = eyeRef.current;
			if (!el) return;

			const eye = el.getBoundingClientRect();
			const eyeCenterX = eye.left + eye.width / 2;
			const eyeCenterY = eye.top + eye.height / 2;

			// Calculate angle and distance from eye center to mouse
			const deltaX = e.clientX - eyeCenterX;
			const deltaY = e.clientY - eyeCenterY;
			const angle = Math.atan2(deltaY, deltaX);
			const distance = Math.hypot(deltaX, deltaY);

			// Maximum distance the pupil can move (allowing it to extend slightly outside the eyeball)
			const maxDistance = size * 0.25; // 25% of eye size for extended movement

			// Calculate pupil position, clamped to max distance
			const constrainedDistance = Math.min(distance, maxDistance);
			const pupilX = Math.cos(angle) * constrainedDistance;
			const pupilY = Math.sin(angle) * constrainedDistance;

			setPupilPosition((prev) => {
				// Avoid updating state if position hasn't meaningfully changed
				if (prev.x === pupilX && prev.y === pupilY) return prev;
				return { x: pupilX, y: pupilY };
			});
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [followCursor, size, defaultPupilOffset]);

	return (
		<div
			className={`relative inline-flex items-center justify-center rounded-full border-foreground bg-background ${className}`}
			ref={eyeRef}
			style={{ borderWidth: mainBorderWidth, height: outerCircleSize, width: outerCircleSize }}
		>
			{/* Inner eyeball */}
			<div
				className="absolute rounded-full bg-gradient-to-b from-primary to-primary/80"
				style={{
					height: eyeballSize,
					width: eyeballSize,
				}}
			/>

			{/* Pupil */}
			<div
				className="absolute rounded-full bg-background"
				style={{
					height: pupilSize,
					transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
					width: pupilSize,
				}}
			/>
		</div>
	);
};

export const TheyEyeOfVision = memo(TheyEyeOfVisionComponent);
