import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
	plugins: [adminClient()],
});

export type Session = typeof authClient.$Infer.Session;
