"use client";

import { useEffect, useRef, useState } from "react";

type TheyEyeOfVisionProps = {
	size?: number;
	className?: string;
};

export const TheyEyeOfVision = ({ size = 150, className = "" }: TheyEyeOfVisionProps) => {
	const eyeRef = useRef<HTMLDivElement>(null);
	const outerCircleSize = size;
	const eyeballSize = outerCircleSize * 0.7; // 70% of outer circle
	const pupilSize = outerCircleSize * 0.32; // 32% of outer circle
	const defaultPupilOffset = size * 0.2; // 20% of eye size for default offset
	const mainBorderWidth = size * 0.03; // 3% of eye size for main border width

	const [pupilPosition, setPupilPosition] = useState({ x: -defaultPupilOffset, y: -defaultPupilOffset });
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!eyeRef.current) return;

			const eye = eyeRef.current.getBoundingClientRect();
			const eyeCenterX = eye.left + eye.width / 2;
			const eyeCenterY = eye.top + eye.height / 2;

			// Calculate angle and distance from eye center to mouse
			const deltaX = e.clientX - eyeCenterX;
			const deltaY = e.clientY - eyeCenterY;
			const angle = Math.atan2(deltaY, deltaX);
			const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

			// Maximum distance the pupil can move (allowing it to extend slightly outside the eyeball)
			const maxDistance = size * 0.25; // 25% of eye size for extended movement

			// Calculate pupil position, clamped to max distance
			const constrainedDistance = Math.min(distance, maxDistance);
			const pupilX = Math.cos(angle) * constrainedDistance;
			const pupilY = Math.sin(angle) * constrainedDistance;

			setPupilPosition({ x: pupilX, y: pupilY });
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [size]);

	return (
		<div
			className={`relative inline-flex items-center justify-center rounded-full border-neutral-800 bg-background dark:border-neutral-200 ${className}`}
			ref={eyeRef}
			style={{ borderWidth: mainBorderWidth, height: outerCircleSize, width: outerCircleSize }}
		>
			{/* Inner eyeball */}
			<div
				className="absolute rounded-full bg-gradient-to-b from-neutral-800 to-neutral-900 dark:from-neutral-200 dark:to-neutral-400"
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
