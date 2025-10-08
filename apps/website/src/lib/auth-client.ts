import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";
export const authClient = createAuthClient({
	fetchOptions: {
		onError(e) {
			if (e.error.status === 429) {
				toast.error("Too many requests. Please try again later.");
			} else {
				toast.error(e.error.message);
			}
		},
	},
	plugins: [adminClient({})],
});

export type Session = typeof authClient.$Infer.Session;

export type User = Session["user"];
export type UserSession = Session["session"];
