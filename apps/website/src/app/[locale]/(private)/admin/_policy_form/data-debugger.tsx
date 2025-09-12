import type { FieldValues, UseFormReturn } from "react-hook-form";

type DataDebuggerProps<T extends FieldValues> = {
	form: UseFormReturn<T>;
	title?: string;
	className?: string;
};

/**
 * A reusable component for debugging form data during development.
 * Displays the current form values in a formatted JSON structure.
 */
export function DataDebugger<T extends FieldValues>({ form, title = "Form Debug Data", className = "" }: DataDebuggerProps<T>) {
	const formData = form.getValues();

	return (
		<div className={`rounded border-2 border-gray-200 ${className}`.trim()}>
			<div className="border-b bg-gray-50 px-3 py-2">
				<h3 className="font-medium text-gray-700 text-sm">{title}</h3>
			</div>
			<pre className="overflow-auto p-4 text-sm">
				<code>{JSON.stringify(formData, null, 2)}</code>
			</pre>
		</div>
	);
}
