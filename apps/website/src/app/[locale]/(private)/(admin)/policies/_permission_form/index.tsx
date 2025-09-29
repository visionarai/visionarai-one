"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PermissionInputType } from "@visionarai-one/abac";
import { BlankConditionalPermissionDecision, PERMISSION_DECISION_TYPES, PermissionDecisionSchema } from "@visionarai-one/abac";
import { ChoiceFormField, Form, Separator, useAsyncFunction } from "@visionarai-one/ui";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";
import { orpcClient } from "@/lib/orpc";
import { ConditionGroupNode } from "./_expression_group_node";

type PermissionFormProps = React.ComponentPropsWithoutRef<"div"> & {
	id: string;
	resource: string;
	action: string;
	permission: PermissionInputType;
	onSuccess?: () => void;
};

export function PermissionForm({ permission, id, resource, action, onSuccess }: PermissionFormProps) {
	const router = useRouter();

	const { execute: updatePolicy } = useAsyncFunction(orpcClient.policies.updateById, {
		onSuccess: () => {
			router.refresh();
			if (onSuccess) {
				onSuccess();
			}
		},
		successMessage: "Policy updated successfully",
	});

	const form = useForm<PermissionInputType>({
		defaultValues: permission,
		resolver: zodResolver(PermissionDecisionSchema),
	});

	const onSubmit = (data: PermissionInputType) => {
		updatePolicy({
			policyId: id,
			updatedFields: {
				permissions: {
					[resource]: {
						[action]: data,
					},
				},
			},
		});
	};

	const current = form.watch();

	return (
		<Form {...form}>
			<div className="space-y-6 px-4">
				<form className="space-y-6" id="permission-form" onSubmit={form.handleSubmit(onSubmit as SubmitHandler<PermissionInputType>)}>
					<div className="space-y-4">
						<div className="space-y-2">
							<h4 className="font-medium text-foreground text-sm">Access Decision</h4>
							<p className="text-muted-foreground text-xs">Choose how this permission should be evaluated for the specified action.</p>
						</div>

						<ChoiceFormField
							assumeMoreOptions
							formControl={form.control}
							label="Decision Type"
							name="decision"
							options={PERMISSION_DECISION_TYPES.map((opt) => ({ label: capitalize(opt), value: opt }))}
						/>
					</div>

					{form.formState.errors && <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>}

					{current.decision === "CONDITIONAL" && (
						<div className="space-y-4">
							<Separator />

							<div className="space-y-2">
								<h4 className="font-medium text-foreground text-sm">Conditional Logic</h4>
								<p className="text-muted-foreground text-xs">Define the conditions that must be met for this permission to be granted.</p>
							</div>

							<div className="rounded-md border bg-muted/20 p-4">
								<ConditionGroupNode
									name="condition"
									onRemove={() => {
										form.reset({ ...current, condition: BlankConditionalPermissionDecision });
									}}
								/>
							</div>
						</div>
					)}
				</form>
			</div>
		</Form>
	);
}

function capitalize(s: string) {
	if (s.length === 0) {
		return s;
	}
	return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
