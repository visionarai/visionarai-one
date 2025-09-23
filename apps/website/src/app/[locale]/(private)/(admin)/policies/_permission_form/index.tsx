"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PermissionInputType } from "@visionarai-one/abac";
import { BlankConditionalPermissionDecision, PERMISSION_DECISION_TYPES, PermissionDecisionSchema } from "@visionarai-one/abac";
import { ChoiceFormField, Form, Separator } from "@visionarai-one/ui";
import { useCallback } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { ConditionGroupNode } from "./_condition_group_node";

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

	const onSubmit = useCallback((data: PermissionInputType) => {
		// keep original behavior (quick demo); memoized for stability
		alert(`Form submitted successfully ${JSON.stringify(data, null, 2)}`);
		// close sheet on submit as well
	}, []);

	const current = form.watch();

	return (
		<Form {...form}>
			<form className="space-y-4" id="permission-form" onSubmit={form.handleSubmit(onSubmit as SubmitHandler<PermissionInputType>)}>
				<span>
					Editing Permission - {id} {resource}:{action}
				</span>
				<ChoiceFormField
					assumeMoreOptions
					formControl={form.control}
					label="Condition Decision"
					name="decision"
					options={PERMISSION_DECISION_TYPES.map((opt) => ({ label: capitalize(opt), value: opt }))}
				/>
				{current.decision === "CONDITIONAL" && (
					<>
						<Separator className="my-2" />
						<ConditionGroupNode
							name="condition"
							onRemove={() => {
								form.reset({ ...current, condition: BlankConditionalPermissionDecision });
							}}
						/>
					</>
				)}
			</form>
		</Form>
	);
}

function capitalize(s: string) {
	if (s.length === 0) {
		return s;
	}
	return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
