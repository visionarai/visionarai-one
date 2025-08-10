import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { ChoiceFormField, DateRangeFormField, DateTimeFormField, InputFormField, PasswordFormField, SwitchFormField, TextAreaFormField } from '../FormInputs';
import type { FieldMetadata } from './types';

// --- Render helpers for each field type ---
const renderInputFormField = <FieldValuesType extends FieldValues>(type: string, fieldMetadata: FieldMetadata, formControl: Control<FieldValuesType>) => {
	const { name, label, placeholder, description } = fieldMetadata;
	return (
		<InputFormField
			autoComplete={'type' in fieldMetadata && 'autoComplete' in fieldMetadata ? fieldMetadata.autoComplete : undefined}
			description={description}
			formControl={formControl}
			inputMode={'type' in fieldMetadata && 'inputMode' in fieldMetadata ? fieldMetadata.inputMode : undefined}
			label={label}
			name={name as FieldPath<FieldValuesType>}
			placeholder={placeholder}
			type={type === 'password-no' ? 'password' : type}
		/>
	);
};

const renderTextAreaFormField = <FieldValuesType extends FieldValues>(fieldMetadata: FieldMetadata, formControl: Control<FieldValuesType>) => {
	const { name, label, placeholder, description } = fieldMetadata;
	return (
		<TextAreaFormField description={description} formControl={formControl} label={label} name={name as FieldPath<FieldValuesType>} placeholder={placeholder} />
	);
};

const renderPasswordFormField = <FieldValuesType extends FieldValues>(fieldMetadata: FieldMetadata, formControl: Control<FieldValuesType>) => {
	const { name, label, placeholder, description } = fieldMetadata;
	return (
		<PasswordFormField
			description={description}
			formControl={formControl}
			label={label}
			name={name as FieldPath<FieldValuesType>}
			passwordRequirements={'passwordRequirements' in fieldMetadata ? fieldMetadata.passwordRequirements : undefined}
			placeholder={placeholder}
		/>
	);
};

const renderSwitchFormField = <FieldValuesType extends FieldValues>(fieldMetadata: FieldMetadata, formControl: Control<FieldValuesType>) => {
	const { name, label, description } = fieldMetadata;
	return <SwitchFormField description={description} formControl={formControl} label={label} name={name as FieldPath<FieldValuesType>} />;
};

const renderDateTimeFormField = <FieldValuesType extends FieldValues>(fieldMetadata: FieldMetadata, formControl: Control<FieldValuesType>) => {
	const { name, label, placeholder, description } = fieldMetadata;
	return (
		<DateTimeFormField
			defaultTime={'defaultTime' in fieldMetadata ? fieldMetadata.defaultTime : { hours: 0, minutes: 0, seconds: 0 }}
			description={description}
			disableDate={'disableDate' in fieldMetadata ? fieldMetadata.disableDate : undefined}
			enableTimePicker={'enableTimePicker' in fieldMetadata ? fieldMetadata.enableTimePicker : false}
			formControl={formControl}
			label={label}
			name={name as FieldPath<FieldValuesType>}
			placeholder={placeholder}
			showSeconds={'showSeconds' in fieldMetadata ? fieldMetadata.showSeconds : false}
		/>
	);
};

const renderDateRangeFormField = <FieldValuesType extends FieldValues>(fieldMetadata: FieldMetadata, formControl: Control<FieldValuesType>) => {
	const { name, label, placeholder, description } = fieldMetadata;
	return (
		<DateRangeFormField
			description={description}
			disableDate={'disableDate' in fieldMetadata ? fieldMetadata.disableDate : undefined}
			formControl={formControl}
			label={label}
			name={name as FieldPath<FieldValuesType>}
			placeholder={placeholder}
		/>
	);
};

const renderChoiceFormField = <FieldValuesType extends FieldValues>(fieldMetadata: FieldMetadata, formControl: Control<FieldValuesType>) => {
	const { name, label, placeholder, description } = fieldMetadata;
	return (
		<ChoiceFormField
			description={description}
			formControl={formControl}
			label={label}
			multiple={'multiple' in fieldMetadata ? fieldMetadata.multiple : false}
			name={name as FieldPath<FieldValuesType>}
			options={'options' in fieldMetadata && fieldMetadata.options ? fieldMetadata.options : []}
			placeholder={placeholder}
		/>
	);
};

export function FieldRenderer<FieldValuesType extends FieldValues, T extends FieldMetadata>({
	formControl,
	fieldMetadata,
}: {
	fieldMetadata: T;
	formControl: Control<FieldValuesType>;
}) {
	const { type } = fieldMetadata;

	if (type === 'text' || type === 'number' || type === 'email' || type === 'password-no') {
		return renderInputFormField(type, fieldMetadata, formControl);
	}
	if (type === 'textarea') {
		return renderTextAreaFormField(fieldMetadata, formControl);
	}
	if (type === 'password') {
		return renderPasswordFormField(fieldMetadata, formControl);
	}
	if (type === 'switch') {
		return renderSwitchFormField(fieldMetadata, formControl);
	}
	if (type === 'datetime') {
		return renderDateTimeFormField(fieldMetadata, formControl);
	}
	if (type === 'dateRange') {
		return renderDateRangeFormField(fieldMetadata, formControl);
	}
	if (type === 'choice') {
		return renderChoiceFormField(fieldMetadata, formControl);
	}
	return null;
}
