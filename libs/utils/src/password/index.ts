import { z } from 'zod/v4';

type MessageKey = 'minLength' | 'maxLength' | 'hasNumber' | 'hasSpecialChar' | 'hasUpperCase';

export type PasswordRequirement = {
	key: string;
	test: (value: string) => boolean;
	messageKey: MessageKey; // i18n key
};

const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
const uppercaseRegex = /[A-Z]/;
const numberRegex = /\d/;

export const passwordRequirements: PasswordRequirement[] = [
	{
		key: 'minLength',
		messageKey: 'minLength', // e.g. "Password must be at least 6 characters long"
		test: (value) => value?.length >= 6,
	},
	{
		key: 'maxLength',
		messageKey: 'maxLength', // e.g. "Password must be at most 100 characters long"
		test: (value) => value?.length <= 100,
	},
	{
		key: 'hasNumber',
		messageKey: 'hasNumber', // e.g. "Password must contain at least one number"
		test: (value) => numberRegex.test(value),
	},
	{
		key: 'hasSpecialChar',
		messageKey: 'hasSpecialChar', // e.g. "Password must contain at least one special character"
		test: (value) => specialCharRegex.test(value),
	},
	{
		key: 'hasUpperCase',
		messageKey: 'hasUpperCase', // e.g. "Password must contain at least one uppercase letter"
		test: (value) => uppercaseRegex.test(value),
	},
];

export const getPasswordRequirements = (t: (key: MessageKey) => string) => {
	return passwordRequirements.map((req) => ({
		...req,
		message: t(req.messageKey), // Translate the message using the provided function
	}));
};

// Helper to generate a Zod schema from requirements
export const passwordZod = z.string().refine((value) => passwordRequirements.every((req) => req.test(value)), {
	message: 'Password must be at least 6 characters long, contain at least one number, one uppercase letter, and one special character.',
});
