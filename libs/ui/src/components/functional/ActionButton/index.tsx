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

import { cn } from "@visionarai-one/utils";

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
	...props
}: ActionButtonProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isLoading, startTransition] = useTransition();
	const { onClick, children, ...rest } = props;

	const handleOnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		startTransition(() => {
			onClick?.(e);
			setIsDialogOpen(false);
		});
	};

	return (
		<>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button {...rest} onClick={requiresConfirmation ? () => setIsDialogOpen(true) : handleOnClick}>
						<LoadingSwap className={cn("flex items-center justify-center gap-2")} isLoading={isLoading}>
							{buttonIcon}
							{children}
						</LoadingSwap>
						<span className="sr-only">{props["aria-label"]}</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent side="bottom">{props["aria-label"]}</TooltipContent>
			</Tooltip>
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
							<Button onClick={handleOnClick} {...rest} size="default" variant={isLoading ? "outline" : confirmButtonVariant}>
								<LoadingSwap className={cn("flex items-center justify-center gap-2")} isLoading={isLoading}>
									{confirmButtonIcon}
									{confirmButtonText}
								</LoadingSwap>
								<span className="sr-only">{confirmButtonText}</span>
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
