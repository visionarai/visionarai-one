"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type MasterDataType, MasterDataZodSchema, type ResourceType } from "@visionarai-one/abac";
import { Button, DataDebugger, Form, InputFormField } from "@visionarai-one/ui";
import { type SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { AttributeInput } from "./attribute-input";

type MasterDataFormProps = {
	defaultValues?: MasterDataType;
};

export default function MasterDataForm({ defaultValues }: MasterDataFormProps) {
	const form = useForm<MasterDataType>({
		defaultValues: defaultValues || {
			resources: [],
		},
		// mode: "onBlur",
		resolver: zodResolver(MasterDataZodSchema),
	});

	const onSubmit = (data: MasterDataType) => {
		alert(JSON.stringify(data, null, 2));
	};

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "resources",
	});

	return (
		<>
			<DataDebugger
				data={{
					errors: form.formState.errors,
					form: form.watch(),
				}}
			/>
			<div>
				<h1 className="font-bold text-2xl">Master Data</h1>
				{defaultValues?.resources?.map((res) => <ResourceRow key={res.name} resource={res} />) || <span>No resources</span>}
			</div>
			<Form {...form}>
				<form className="space-y-4 p-4" onSubmit={form.handleSubmit(onSubmit as SubmitHandler<MasterDataType>)}>
					{fields.map((field, index) => (
						<div className="flex gap-4 rounded border p-4 [&>:not(:last-child)]:flex-1" key={field.id}>
							<InputFormField formControl={form.control} label={"Resource Name"} name={`resources.${index}.name`} placeholder="Enter resource name" />
							<AttributeInput formControl={form.control} resourceIndex={index} />
							<Button onClick={() => remove(index)} type="button">
								Remove
							</Button>
						</div>
					))}
					<Button onClick={() => append({ name: "" })} type="button">
						Add Resource
					</Button>
					{/* Add other fields as necessary */}
					<Button type="submit">Submit</Button>
				</form>
			</Form>
		</>
	);
}

type ResourceRowProps = {
	resource: ResourceType;
};

function ResourceRow({ resource }: ResourceRowProps) {
	return (
		<div className="rounded border p-4">
			<h2 className="font-bold">{resource.name}</h2>

			<div>
				<h3 className="font-semibold">Attributes</h3>
				<ul>
					{resource.attributes?.map((attr) => (
						<li key={attr.key}>
							{attr.key} ({attr.type})
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
