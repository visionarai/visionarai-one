"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PermissionInputType } from "@visionarai-one/abac";
import { BlankConditionalPermissionDecision, PERMISSION_DECISION_TYPES, PermissionDecisionSchema } from "@visionarai-one/abac";
import { ChoiceFormField, Form, Separator } from "@visionarai-one/ui";
import { type SubmitHandler, useForm } from "react-hook-form";
import { ConditionGroupNode } from "./_expression_group_node";

type PermissionFormProps = React.ComponentPropsWithoutRef<"div"> & {
	id: string;
	resource: string;
	action: string;
	permission: PermissionInputType;
};

export function PermissionForm({ permission, id, resource, action }: PermissionFormProps) {
	const form = useForm<PermissionInputType>({
		defaultValues: permission,
		resolver: zodResolver(PermissionDecisionSchema),
	});

	const onSubmit = (data: PermissionInputType) => {
		// keep original behavior (quick demo); memoized for stability
		alert(`Form submitted successfully ${JSON.stringify({ action, data, id, resource }, null, 2)}`);
		// close sheet on submit as well
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
