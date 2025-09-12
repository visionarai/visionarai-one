"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { nullPolicy, type PolicyType, PolicyTypeSchema } from "@visionarai-one/access-control";
import { Button, DataDebugger, Form, InputFormField } from "@visionarai-one/ui";
import { type SubmitHandler, useForm } from "react-hook-form";
import { RenderConditionFields } from "./condition-input";
export default function PolicyForm() {
	const form = useForm({
		defaultValues: nullPolicy,
		// mode: "onBlur",
		resolver: zodResolver(PolicyTypeSchema),
	});

	const onSubmit = (data: unknown) => {
		alert(JSON.stringify(data, null, 2));
	};

	return (
		<>
			<DataDebugger data={{ form: form.watch() }} />
			<Form {...form}>
				<form className="space-y-4 p-4" onSubmit={form.handleSubmit(onSubmit as SubmitHandler<PolicyType>)}>
					<InputFormField formControl={form.control} label="Name" name="name" placeholder="Enter policy name" />
					<InputFormField formControl={form.control} label="Description" name="description" placeholder="Enter policy description" />
					<RenderConditionFields formControl={form.control} name="globalConditions" />
					<Button type="submit">Submit</Button>
				</form>
			</Form>
		</>
	);
}
