"use client";

import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@visionarai-one/ui";
import { Trash2, XIcon } from "lucide-react";
import { useState } from "react";

type ButtonVariants = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";

type ActionConfirmationButtonProps = React.ComponentPropsWithoutRef<"div"> & {
	actionButtonText?: string;
	actionButtonIcon?: React.ReactNode;
	actionButtonVariant?: ButtonVariants;
	dialogTitle?: string;
	dialogDescription?: string;
	confirmButtonText?: string;
	confirmButtonIcon?: React.ReactNode;
	cancelButtonText?: string;
	cancelButtonIcon?: React.ReactNode;
	onConfirm?: () => void;
	dialogOpenDefault?: boolean;
	variant?: ButtonVariants;
};

export function ActionConfirmationButton({
	actionButtonText = "Delete",
	actionButtonIcon = <Trash2 />,
	actionButtonVariant = "ghost",
	dialogTitle = "Are you sure?",
	dialogDescription = "This action cannot be undone. Please confirm you want to proceed.",
	confirmButtonText = "Confirm",
	confirmButtonIcon = <Trash2 />,
	cancelButtonText = "Cancel",
	cancelButtonIcon = <XIcon />,
	onConfirm = () => {
		alert("Confirmed");
	},
	dialogOpenDefault: open = false,
	variant = "destructive",
	...props
}: ActionConfirmationButtonProps) {
	const [dialogOpen, setDialogOpenState] = useState(open);
	return (
		<Dialog {...props} onOpenChange={setDialogOpenState} open={dialogOpen}>
			<Tooltip>
				<TooltipTrigger asChild>
					<DialogTrigger asChild>
						<Button aria-label={actionButtonText} size="icon" variant={actionButtonVariant}>
							{actionButtonIcon}
							<span className="sr-only">{actionButtonText}</span>
						</Button>
					</DialogTrigger>
				</TooltipTrigger>
				<TooltipContent side="bottom">{actionButtonText}</TooltipContent>
			</Tooltip>
			<DialogContent>
				<DialogHeader>
					<DialogTitle> {dialogTitle} </DialogTitle>
					<DialogDescription>{dialogDescription}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">
							{cancelButtonIcon} {cancelButtonText}
						</Button>
					</DialogClose>
					<Button
						onClick={() => {
							setDialogOpenState?.(false);
							onConfirm();
						}}
						variant={variant}
					>
						{confirmButtonIcon} {confirmButtonText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
