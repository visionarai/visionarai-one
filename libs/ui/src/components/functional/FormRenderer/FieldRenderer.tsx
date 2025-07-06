import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { ChoiceFormField, DateRangeFormField, DateTimeFormField, InputFormField, PasswordFormField, SwitchFormField, TextAreaFormField } from '../FormInputs';
import { FieldMetadata } from './types';

export function FieldRenderer<FieldValuesType extends FieldValues, T extends FieldMetadata>({
  formControl,
  fieldMetadata,
}: {
  fieldMetadata: T;
  formControl: Control<FieldValuesType>;
}) {
  const { type, name, label, placeholder, description } = fieldMetadata;
  const commonProps = {
    name: name as FieldPath<FieldValuesType>,
    label,
    formControl,
    placeholder,
    description,
  };

  switch (type) {
    case 'text':
    case 'number':
    case 'email':
      return (
        <InputFormField
          {...commonProps}
          type={type}
          autoComplete={'type' in fieldMetadata && 'autoComplete' in fieldMetadata ? fieldMetadata.autoComplete : undefined}
          inputMode={'type' in fieldMetadata && 'inputMode' in fieldMetadata ? fieldMetadata.inputMode : undefined}
        />
      );
    case 'textarea':
      return <TextAreaFormField {...commonProps} />;
    case 'password':
      return (
        <PasswordFormField
          {...commonProps}
          passwordRequirements={'passwordRequirements' in fieldMetadata ? fieldMetadata.passwordRequirements : undefined}
        />
      );
    case 'switch':
      return <SwitchFormField {...commonProps} />;
    case 'datetime':
      return (
        <DateTimeFormField
          {...commonProps}
          disableDate={'disableDate' in fieldMetadata ? fieldMetadata.disableDate : undefined}
          enableTimePicker={'enableTimePicker' in fieldMetadata ? fieldMetadata.enableTimePicker : false}
          showSeconds={'showSeconds' in fieldMetadata ? fieldMetadata.showSeconds : false}
          defaultTime={'defaultTime' in fieldMetadata ? fieldMetadata.defaultTime : { hours: 0, minutes: 0, seconds: 0 }}
        />
      );
    case 'dateRange':
      return (
        <DateRangeFormField
          {...commonProps}
          disableDate={'disableDate' in fieldMetadata ? fieldMetadata.disableDate : undefined}
        />
      );
    case 'choice':
      return (
        <ChoiceFormField
          {...commonProps}
          multiple={'multiple' in fieldMetadata ? fieldMetadata.multiple : false}
          options={'options' in fieldMetadata && fieldMetadata.options ? fieldMetadata.options : []}
        />
      );
    default:
      return null;
  }
}
