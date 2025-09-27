"use client";

import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@visionarai-one/ui";
import { Trash2, XIcon } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";

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
	actionButtonText,
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
	dialogOpenDefault = false,
	variant = "destructive",
	...props
}: ActionConfirmationButtonProps) {
	const [dialogOpen, setDialogOpenState] = useQueryState("actionConfirmationDialogOpen", parseAsBoolean.withDefault(dialogOpenDefault));
	return (
		<Dialog {...props} onOpenChange={setDialogOpenState} open={dialogOpen}>
			<DialogTrigger asChild>
				<Button size="sm" variant={actionButtonVariant}>
					{actionButtonIcon} {actionButtonText}
				</Button>
			</DialogTrigger>
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
