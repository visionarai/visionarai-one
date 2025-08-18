'use client';

import { FormRenderer, stringifyFieldMetadata } from '@visionarai-one/ui';
import { getPasswordRequirements, passwordZod } from '@visionarai-one/utils';
import { useTranslations } from 'next-intl';
import { z } from 'zod/v4';

const COMMENTS_MAX_LENGTH = 500;
const TOPICS_MAX_LENGTH = 5;
const TOPICS_MIN_LENGTH = 1;

const AllTopics = [
	{ label: 'Technology', value: 'technology' },
	{ label: 'Health', value: 'health' },
	{ label: 'Finance', value: 'finance' },
	{ label: 'Education', value: 'education' },
	{ label: 'Science', value: 'science' },
	{ label: 'Art', value: 'art' },
	{ label: 'Sports', value: 'sports' },
	{ label: 'Travel', value: 'travel' },
	{ label: 'Food', value: 'food' },
	{ label: 'Lifestyle', value: 'lifestyle' },
	{ label: 'Entertainment', value: 'entertainment' },
	{ label: 'Environment', value: 'environment' },
	{ label: 'Politics', value: 'politics' },
	{ label: 'History', value: 'history' },
];

const formSchema = z
	.object({
		address: z.object({
			city: z
				.string()
				.optional()
				.describe(
					stringifyFieldMetadata({
						description: 'The city where you live.',
						label: 'City',
						name: 'address.city',
						placeholder: 'Enter your city',
						type: 'text',
					})
				),
			street: z
				.string()
				.optional()
				.describe(
					stringifyFieldMetadata({
						autoComplete: 'street-address',
						description: 'Your street address including house number and street name.',
						inputMode: 'text',
						label: 'Street Address',
						name: 'address.street',
						placeholder: 'Enter your street address',
						type: 'text',
					})
				),
		}),
		comments: z
			.string()
			.max(COMMENTS_MAX_LENGTH, `Comments must be less than ${COMMENTS_MAX_LENGTH} characters`)
			.describe(
				stringifyFieldMetadata({
					description: 'Feel free to share any additional information.',
					label: 'Comments',
					name: 'comments',
					placeholder: 'Any additional comments?',
					type: 'textarea',
				})
			),
		date: z
			.date()
			.optional()
			.describe(
				stringifyFieldMetadata({
					description: 'Choose a date for your appointment.',
					enableTimePicker: true,
					label: 'Select a Date',
					name: 'date',
					placeholder: 'Pick a date',
					type: 'datetime',
				})
			),
		dateRange: z
			.object({ from: z.date().optional(), to: z.date().optional() })
			.optional()
			.describe(
				stringifyFieldMetadata({
					description: 'Choose a date range for your booking.',
					label: 'Select a Date Range',
					name: 'dateRange',
					placeholder: 'Pick a date range',
					type: 'dateRange',
				})
			),
		email: z.email('Invalid email address').describe(
			stringifyFieldMetadata({
				autoComplete: 'email',
				description: 'We will never share your email with anyone else.',
				inputMode: 'email',
				label: 'Email',
				name: 'email',
				placeholder: 'Enter your email',
				type: 'email',
			})
		),
		password: passwordZod.describe(
			stringifyFieldMetadata({
				description: 'Your password must be at least 6 characters long.',
				label: 'Password',
				name: 'password',
				placeholder: 'Enter your password',
				type: 'password',
			})
		),
		selectedTopic: z
			.string()
			.optional()
			.describe(
				stringifyFieldMetadata({
					description: 'Select a topic that interests you.',
					label: 'Select a Topic',
					name: 'selectedTopic',
					options: AllTopics,
					placeholder: 'Choose a topic',
					type: 'choice',
				})
			),
		selectedTopics: z
			.array(z.string())
			.min(TOPICS_MIN_LENGTH, 'At least one topic must be selected')
			.max(TOPICS_MAX_LENGTH, `You can select up to ${TOPICS_MAX_LENGTH} topics`)
			.describe(
				stringifyFieldMetadata({
					description: 'Select topics that interest you.',
					label: 'Select Topics',
					multiple: true,
					name: 'selectedTopics',
					options: AllTopics,
					placeholder: 'Choose topics',
					type: 'choice',
				})
			),
		subscribe: z
			.boolean()
			.optional()
			.describe(
				stringifyFieldMetadata({
					description: 'Receive updates and news via email.',
					label: 'Subscribe to newsletter',
					name: 'subscribe',
					type: 'switch',
				})
			),
	})
	.refine((data) => data.selectedTopic || data.selectedTopics.length > 0, {
		message: 'Please select at least one topic',
	});

export function LoginForm() {
	const passwordT = useTranslations('Auth.passwordRequirements');

	const passwordRequirements = getPasswordRequirements(passwordT);

	return (
		<FormRenderer
			formSchema={formSchema}
			onSubmit={(data) => {
				// biome-ignore lint/suspicious/noConsole: TODO: Remove in production
				console.log('Form submitted:', data);
			}}
			passwordRequirements={passwordRequirements}
		/>
	);
}
