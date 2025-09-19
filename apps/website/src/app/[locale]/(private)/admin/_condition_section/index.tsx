"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { type PermissionInputType, PermissionSchema, type PermissionType, permissionExample } from "@visionarai-one/abac";
import { Button, DataDebugger, Form } from "@visionarai-one/ui";
import { type SubmitHandler, useForm } from "react-hook-form";

import { ConditionGroupNode } from "../_condition_group_node";

export function ConditionSection() {
	const form = useForm<PermissionInputType, unknown, PermissionType>({
		defaultValues: permissionExample,
		resolver: zodResolver(PermissionSchema),
	});

	const onSubmit = (data: PermissionType) => {
		alert(`Form submitted successfully ${JSON.stringify(data, null, 2)}`);
	};

	return (
		<div>
			<DataDebugger data={form.watch()} />
			<Form {...form}>
				<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit as SubmitHandler<PermissionType>)}>
					<ConditionGroupNode
						name="conditions"
						onRemove={() => {
							form.setValue("conditions", { conditions: [], logic: "AND" });
						}}
					/>
					{/* <ConditionBuilder
						onChange={(next) => form.setValue("conditions", next, { shouldDirty: true, shouldValidate: true })}
						title="Conditions"
						value={form.getValues("conditions") as PermissionType["conditions"]}
					/> */}
					<Button type="submit">Submit</Button>
				</form>
			</Form>
		</div>
	);
}
