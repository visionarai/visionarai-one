# @visionarai-one/ui

Lightweight React UI library for Visionarai projects:
- UI primitives are shadcn/ui components (unstyled logic kept minimal)
- Functional components are reusable, higher-level components with behavior (not just visuals)
- Form system built on react-hook-form + Zod with metadata-driven rendering

> [!NOTE]
> This package is part of an Nx monorepo and is imported as `@visionarai-one/ui` from other apps/libs.


## What’s inside

- UI primitives (shadcn): `Button`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Dialog`, `Calendar`, `Popover`, `Command`, `Label`, `Card`, `Badge`, `Form`, `MultiSelect` and more.
- Functional components:
	- `ThemeSwitcher`: toggles dark/light themes
	- `NavBar`, `Footer`: ready-to-use layout pieces
	- Forms
		- `FormInputs`: field-level building blocks wired to react-hook-form
			- `InputFormField`, `PasswordFormField`, `TextAreaFormField`, `SwitchFormField`
			- `ChoiceFormField` (single/multi select, combobox, radio/checkbox)
			- `DateTimeFormField`, `DateRangeFormField`
		- `FormRenderer`: renders a whole form from a Zod schema described with field metadata


## UI primitives = shadcn components

All components under `components/ui/` are thin shadcn wrappers. Use them as you would shadcn:

```tsx
import { Button, Input, Select, SelectTrigger, SelectContent, SelectItem } from '@visionarai-one/ui';

export function Example() {
	return (
		<div className="space-y-4">
			<Input placeholder="Type here" />
			<Button>Click</Button>
			<Select>
				<SelectTrigger />
				<SelectContent>
					<SelectItem value="a">A</SelectItem>
					<SelectItem value="b">B</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
```

> [!TIP]
> Because these are shadcn primitives, compose them freely and style with Tailwind.


## Functional components = reusable UI + behavior

Functional components live under `components/functional/` and include logic and sensible defaults, while remaining unopinionated.

- Layout: `NavBar`, `Footer`
- Theme: `ThemeSwitcher`
- Forms: `FormInputs` (field-level) and `FormRenderer` (schema-driven forms)


## Forms: react-hook-form + Zod, metadata-driven

The form system combines:
- `react-hook-form` for state and validation plumbing
- `@hookform/resolvers/zod` to validate with Zod
- Zod schema `describe()` to carry UI metadata for each field
- `FormRenderer` to auto-render fields from the schema metadata

> [!IMPORTANT]
> Field UI metadata is carried in the Zod schema via `schema.describe(string)`. We use a JSON string containing a `FieldMetadata` object.

### Field metadata (contract)

```ts
type FieldMetadata = {
	name: string;            // dot-path supported, e.g. "address.city"
	label: string;           // if omitted, derived from name (Title Case)
	placeholder?: string;
	description?: string;
	conditional?: { dependsOn: string; value: unknown };
} & (
	| { type: 'text' | 'number' | 'email' | 'password-no'; inputMode?: 'numeric' | 'text' | 'email'; autoComplete?: string }
	| { type: 'textarea' }
	| { type: 'password'; passwordRequirements?: PasswordRequirementProps[] }
	| { type: 'switch' }
	| { type: 'datetime'; disableDate?: (d: Date) => boolean; enableTimePicker?: boolean; showSeconds?: boolean; defaultTime?: { hours: number; minutes: number; seconds: number } }
	| { type: 'dateRange'; disableDate?: (d: Date) => boolean }
	| { type: 'choice'; multiple?: boolean; options: SelectOption[] }
)

type SelectOption = { value: string; label: string; disabled?: boolean };
type PasswordRequirementProps = { key: string; test: (value: string) => boolean; message: string };
```

> [!NOTE]
> `password-no` renders a plain password `<input>` (no live requirements UI). Use `password` for the enhanced password field.


### FormInputs (field-level components)

All inputs accept `name`, `label`, and a `formControl` from `useForm()`.

- `InputFormField`
	- Standard text-like inputs, supports `type`, `inputMode`, `autoComplete`, `placeholder`, `description`.
- `PasswordFormField`
	- Password visibility toggle and live “requirements met” list via `passwordRequirements`.
- `TextAreaFormField`
	- Multiline input with validation message/description.
- `SwitchFormField`
	- Boolean toggle with inline label/description.
- `ChoiceFormField`
	- Smart rendering based on options count and `multiple`:
		- multiple=true: `MultiSelect` (>=10 options) or checkbox group (<10)
		- multiple=false: Combobox (>=10), `Select` (5–9), or `RadioGroup` (<5)
- `DateTimeFormField`
	- Date picker with optional time picker (`enableTimePicker`, `showSeconds`), `disableDate`, and `defaultTime` behavior.
- `DateRangeFormField`
	- Range calendar (2 months), supports `disableDate` and formatted preview.


### FormRenderer (schema → form)

`FormRenderer` extracts `FieldMetadata` from your Zod schema and renders the right `FormInputs` automatically.

Props:
- `formSchema: z.ZodObject`
- `onSubmit: (data) => void`
- `defaultValues?: DefaultValues`
- `passwordRequirements?: PasswordRequirementProps[]` (applies to all `password` fields)
- `submitButtonText`, `submitButtonIcon`, `resetButtonText`, `resetButtonIcon`

Behavior:
- Uses `zodResolver(schema)` with `react-hook-form`
- Derives labels from `name` if missing
- Renders a submit and reset button row


## Example: end-to-end form

Below mirrors the sample in `apps/website/.../(auth)/form/_form.tsx`.

```tsx
'use client';

import { FormRenderer, stringifyFieldMetadata } from '@visionarai-one/ui';
import { getPasswordRequirements, passwordZod } from '@visionarai-one/utils';
import { useTranslations } from 'next-intl';
import { z } from 'zod/v4';

const ALL_TOPICS = [
	{ value: 'technology', label: 'Technology' },
	{ value: 'health', label: 'Health' },
	// ...
];

const formSchema = z
	.object({
		email: z.email('Invalid email address').describe(
			stringifyFieldMetadata({
				name: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email',
				description: 'We will never share your email with anyone else.', inputMode: 'email', autoComplete: 'email'
			})
		),
		password: passwordZod.describe(
			stringifyFieldMetadata({
				name: 'password', type: 'password', label: 'Password', placeholder: 'Enter your password',
				description: 'Your password must be at least 6 characters long.'
			})
		),
		comments: z.string().max(500).describe(
			stringifyFieldMetadata({ name: 'comments', type: 'textarea', label: 'Comments', placeholder: 'Any additional comments?' })
		),
		selectedTopic: z.string().optional().describe(
			stringifyFieldMetadata({ name: 'selectedTopic', type: 'choice', label: 'Select a Topic', options: ALL_TOPICS })
		),
		address: z.object({
			street: z.string().optional().describe(
				stringifyFieldMetadata({ name: 'address.street', type: 'text', label: 'Street Address', autoComplete: 'street-address' })
			),
			city: z.string().optional().describe(
				stringifyFieldMetadata({ name: 'address.city', type: 'text', label: 'City' })
			),
		}),
		selectedTopics: z.array(z.string()).min(1).max(5).describe(
			stringifyFieldMetadata({ name: 'selectedTopics', type: 'choice', multiple: true, label: 'Select Topics', options: ALL_TOPICS })
		),
		subscribe: z.boolean().optional().describe(
			stringifyFieldMetadata({ name: 'subscribe', type: 'switch', label: 'Subscribe to newsletter' })
		),
		date: z.date().optional().describe(
			stringifyFieldMetadata({ name: 'date', type: 'datetime', label: 'Select a Date', enableTimePicker: true })
		),
		dateRange: z.object({ from: z.date().optional(), to: z.date().optional() }).optional().describe(
			stringifyFieldMetadata({ name: 'dateRange', type: 'dateRange', label: 'Select a Date Range' })
		),
	})
	.refine((data) => data.selectedTopic || data.selectedTopics.length > 0, { message: 'Please select at least one topic' });

export function LoginForm() {
	const t = useTranslations('Auth.passwordRequirements');
	const passwordRequirements = getPasswordRequirements((key) => t(key));

	return (
		<FormRenderer
			formSchema={formSchema}
			onSubmit={(data) => console.log('Form submitted:', data)}
			passwordRequirements={passwordRequirements}
		/>
	);
}
```

> [!TIP]
> If you don’t want to import `stringifyFieldMetadata`, you can inline `JSON.stringify({...})`—the helper simply wraps `JSON.stringify` with type safety.


## API hints and behaviors

- Choice rendering rules
	- 10+ options: Combobox (single) / MultiSelect (multiple)
	- 5–9 options: Select (single)
	- <5 options: RadioGroup (single) / Checkbox group (multiple)

- DateTime field
	- `enableTimePicker` preserves time when changing date; otherwise `defaultTime` is applied.
	- Uses `next-intl` `useFormatter()` for localized formatting.

- Password field
	- Pass localized requirements via `passwordRequirements` (see `@visionarai-one/utils` → `getPasswordRequirements` and `passwordZod`).

- Labels & errors
	- `FormLabel`, `FormMessage`, and optional `FormDescription` are rendered consistently across inputs.


## Imports

```ts
// UI primitives
import { Button, Input, Form, Select, Checkbox, RadioGroup, Switch, Popover, Command, Calendar, MultiSelect } from '@visionarai-one/ui';

// Functional form inputs
import { InputFormField, PasswordFormField, TextAreaFormField, SwitchFormField, ChoiceFormField, DateTimeFormField, DateRangeFormField } from '@visionarai-one/ui';

// Full form renderer
import { FormRenderer } from '@visionarai-one/ui';

// Types
import type { SelectOption } from '@visionarai-one/ui';
// PasswordRequirementProps is exported by PasswordFormField
```


## Notes

- Ensure each Zod field has a `describe(JSON.stringify(FieldMetadata))` if you want it rendered by `FormRenderer`.
- Nested fields use dot-path names (e.g., `address.city`).
- You can still build forms manually with `FormInputs` if you prefer full control.

> [!NOTE]
> UI primitives are intentionally thin to keep flexibility; functional components add behavior while staying framework-friendly and accessible.

