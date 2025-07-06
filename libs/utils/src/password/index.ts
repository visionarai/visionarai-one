import { z } from 'zod/v4';

type MessageKey = 'minLength' | 'maxLength' | 'hasNumber' | 'hasSpecialChar' | 'hasUpperCase';

export type PasswordRequirement = {
  key: string;
  test: (value: string) => boolean;
  messageKey: MessageKey; // i18n key
};

export const passwordRequirements: PasswordRequirement[] = [
  {
    key: 'minLength',
    test: value => value?.length >= 6,
    messageKey: 'minLength', // e.g. "Password must be at least 6 characters long"
  },
  {
    key: 'maxLength',
    test: value => value?.length <= 100,
    messageKey: 'maxLength', // e.g. "Password must be at most 100 characters long"
  },
  {
    key: 'hasNumber',
    test: value => /\d/.test(value),
    messageKey: 'hasNumber', // e.g. "Password must contain at least one number"
  },
  {
    key: 'hasSpecialChar',
    test: value => /[!@#$%^&*(),.?":{}|<>]/.test(value),
    messageKey: 'hasSpecialChar', // e.g. "Password must contain at least one special character"
  },
  {
    key: 'hasUpperCase',
    test: value => /[A-Z]/.test(value),
    messageKey: 'hasUpperCase', // e.g. "Password must contain at least one uppercase letter"
  },
];

export const getPasswordRequirements = (t: (key: MessageKey) => string) => {
  return passwordRequirements.map(req => ({
    ...req,
    message: t(req.messageKey), // Translate the message using the provided function
  }));
};

// Helper to generate a Zod schema from requirements
export const passwordZod = z.string().refine(value => passwordRequirements.every(req => req.test(value)), {
  message: 'Password must be at least 6 characters long, contain at least one number, one uppercase letter, and one special character.',
});
