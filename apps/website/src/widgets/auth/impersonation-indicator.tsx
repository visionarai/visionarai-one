"use client";

import { ActionButton, useBetterAuthFunction } from "@visionarai-one/ui";
import { UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function ImpersonationIndicator() {
	const router = useRouter();
	const { data: session, refetch } = authClient.useSession();
	const [stopImpersonating] = useBetterAuthFunction(authClient.admin.stopImpersonating, {
		loadingMessage: "Stopping impersonation...",
		onSuccess: () => {
			refetch();
			router.push("/user-management");
			router.refresh();
		},
		successMessage: "Stopped impersonating user",
	});

	if (session?.session.impersonatedBy == null) return null;

	return <ActionButton aria-label="Stop Impersonating" buttonIcon={<UserX />} onClick={() => stopImpersonating()} size="icon" variant="destructive" />;
}
