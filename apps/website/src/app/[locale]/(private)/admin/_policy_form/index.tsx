"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { nullPolicy, type PolicyType, PolicyTypeSchema } from "@visionarai-one/access-control";
import { Button, Form, InputFormField } from "@visionarai-one/ui";
import { type SubmitHandler, useForm } from "react-hook-form";
import { RenderConditionFields } from "./condition-input";
import { DataDebugger } from "./data-debugger";
import { createAlertSubmitHandler } from "./form-submit-handler";
export default function PolicyForm() {
	const form = useForm({
		defaultValues: nullPolicy,
		mode: "onChange",
		resolver: zodResolver(PolicyTypeSchema),
	});

	const onSubmit = createAlertSubmitHandler();

	return (
		<>
			<DataDebugger className="mb-4" form={form} title="Policy Form Debug" />
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
