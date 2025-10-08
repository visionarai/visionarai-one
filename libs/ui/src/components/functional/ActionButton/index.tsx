"use client";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	LoadingSwap,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@visionarai-one/ui";

import { Trash2, XIcon } from "lucide-react";
import { type ComponentProps, type ReactNode, useState, useTransition } from "react";

type ActionButtonProps = ComponentProps<typeof Button> & {
	buttonIcon?: ReactNode;
	requiresConfirmation?: boolean;
	confirmDialogTitle?: ReactNode;
	confirmDialogDescription?: ReactNode;
	confirmButtonText?: ReactNode;
	cancelButtonText?: ReactNode;
	confirmButtonVariant?: ComponentProps<typeof Button>["variant"];
	confirmButtonIcon?: ReactNode;
	cancelButtonIcon?: ReactNode;
	labelAsText?: boolean;
	showTooltip?: boolean;
};

export function ActionButton({
	buttonIcon,
	requiresConfirmation = false,
	confirmDialogTitle = "Are you sure?",
	confirmDialogDescription = "This action cannot be undone.",
	confirmButtonText = "Yes, delete",
	cancelButtonText = "No, cancel",
	confirmButtonVariant = "destructive",
	confirmButtonIcon = <Trash2 />,
	cancelButtonIcon = <XIcon />,
	labelAsText = false,
	showTooltip = true,
	onClick,
	children,

	...rest
}: ActionButtonProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isLoading, startTransition] = useTransition();
	const label = rest["aria-label"];

	const handleOnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		startTransition(() => {
			onClick?.(e);
			setIsDialogOpen(false);
		});
	};

	return (
		<>
			{showTooltip ? (
				<Tooltip>
					<TooltipTrigger asChild>
						<Button {...rest} onClick={requiresConfirmation ? () => setIsDialogOpen(true) : handleOnClick}>
							<LoadingSwap isLoading={isLoading}>{buttonIcon}</LoadingSwap>
							{labelAsText && label}
							{children}
							<span className="sr-only">{label}</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom">{label}</TooltipContent>
				</Tooltip>
			) : (
				<Button {...rest} onClick={requiresConfirmation ? () => setIsDialogOpen(true) : handleOnClick}>
					<LoadingSwap isLoading={isLoading}>{buttonIcon}</LoadingSwap>
					{labelAsText && label}
					{children}
					<span className="sr-only">{label}</span>
				</Button>
			)}
			{requiresConfirmation && (
				<Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{confirmDialogTitle}</DialogTitle>
							<DialogDescription>{confirmDialogDescription}</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button onClick={() => setIsDialogOpen(false)} variant="outline">
								{cancelButtonIcon}
								{cancelButtonText}
								<span className="sr-only">{cancelButtonText}</span>
							</Button>
							<Button onClick={handleOnClick} size="default" variant={isLoading ? "outline" : confirmButtonVariant}>
								<LoadingSwap isLoading={isLoading}>{confirmButtonIcon}</LoadingSwap>
								{confirmButtonText}
								<span className="sr-only">{confirmButtonText}</span>
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
