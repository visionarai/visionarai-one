"use client";

import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	FormRenderer,
	stringifyFieldMetadata,
	useAsyncFunction,
} from "@visionarai-one/ui";
import { Plus } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { z } from "zod";
import { useRouter } from "@/i18n/navigation";
import { orpcClient } from "@/lib/orpc";

// biome-ignore assist/source/useSortedKeys: For proper order of fields
const CreateNewPolicyInputSchema = z.object({
	createdBy: z.string().min(1, "Creator's user ID is required"),
	name: z
		.string()
		.min(1)
		.describe(
			stringifyFieldMetadata({
				description: "The name of the policy",
				inputMode: "text",
				label: "Name",
				name: "name",
				placeholder: "Enter policy name",
				type: "text",
			})
		),
	description: z
		.string()
		.min(1, "Description is required")
		.describe(
			stringifyFieldMetadata({
				description: "A brief description of the policy",
				inputMode: "text",
				label: "Description",
				name: "description",
				placeholder: "Enter policy description",
				type: "text",
			})
		),
});

export const CreateNewPolicy = () => {
	const router = useRouter();
	const [createNewDialogOpen, setCreateNewDialogOpen] = useQueryState("createNewDialogOpen", parseAsBoolean.withDefault(false));

	const { execute } = useAsyncFunction(orpcClient.policies.createPlaceholderPolicy, {
		onSuccess: () => {
			router.replace("/policies");
		},
		successMessage: "Policy created successfully",
	});

	return (
		<Dialog onOpenChange={setCreateNewDialogOpen} open={createNewDialogOpen}>
			<DialogTrigger asChild>
				<Button size="sm">
					<Plus className="h-4 w-4" />
					Create New Policy
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New Policy</DialogTitle>
					<DialogDescription>Fill in the details for the new policy.</DialogDescription>
				</DialogHeader>
				<FormRenderer
					defaultValues={{ createdBy: "userId", description: "A new policy", name: "New Policy" }}
					formSchema={CreateNewPolicyInputSchema}
					onSubmit={async (data) => {
						await execute(data);
					}}
				/>
			</DialogContent>
		</Dialog>
	);
};
