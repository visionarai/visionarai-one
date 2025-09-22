"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PermissionInputType } from "@visionarai-one/abac";
import { BlankConditionalPermissionDecision, PermissionDecisionSchema } from "@visionarai-one/abac";
import { Button, DataDebugger, Form, InputFormField } from "@visionarai-one/ui";
import { type SubmitHandler, useForm } from "react-hook-form";

import { ConditionGroupNode } from "../_condition_group_node";

type ConditionSectionProps = React.ComponentPropsWithoutRef<"div"> & {
	defaultValues?: PermissionInputType;
};

export function ConditionSection({ defaultValues }: ConditionSectionProps) {
	const form = useForm<PermissionInputType>({
		defaultValues,
		resolver: zodResolver(PermissionDecisionSchema),
	});

	const onSubmit = (data: PermissionInputType) => {
		alert(`Form submitted successfully ${JSON.stringify(data, null, 2)}`);
	};

	return (
		<div>
			<Form {...form}>
				<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit as SubmitHandler<PermissionInputType>)}>
					<InputFormField formControl={form.control} label="Permission Name" name="decision" />
					{form.getValues("decision") === "CONDITIONAL" && (
						<>
							<DataDebugger data={form.watch()} />
							<ConditionGroupNode
								name="condition"
								onRemove={() => {
									const current = form.getValues();
									if (current.decision === "CONDITIONAL") {
										form.reset({ ...current, condition: BlankConditionalPermissionDecision });
									} else {
										form.reset(current);
									}
								}}
							/>
						</>
					)}

					<Button type="submit">Submit</Button>
				</form>
			</Form>
		</div>
	);
}
