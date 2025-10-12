"use client";

import {
	ActionButton,
	Badge,
	Card,
	CardContent,
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
	useBetterAuthFunction,
} from "@visionarai-one/ui";
import type { Session } from "better-auth";
import { Monitor, Smartphone, Tablet, Trash2 } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { UAParser } from "ua-parser-js";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";

type SessionsTabProps = {
	currentSessionToken: string;
	sessions: Session[];
};
export function SessionsTab({ currentSessionToken, sessions }: SessionsTabProps) {
	const t = useTranslations("Account.tabs.sessions");
	const otherSessions = sessions.filter((s) => s.token !== currentSessionToken);
	const currentSession = sessions.find((s) => s.token === currentSessionToken);
	return (
		<section className="space-y-6">
			{currentSession && <SessionCard isCurrentSession session={currentSession} />}

			{otherSessions.length === 0 ? (
				<Card>
					<CardContent className="py-8 text-center text-muted-foreground">{t("no_other_sessions")}</CardContent>
				</Card>
			) : (
				<div className="space-y-3">
					{otherSessions.map((session) => (
						<SessionCard key={session.id} session={session} />
					))}
				</div>
			)}
		</section>
	);
}

function SessionCard({ session, isCurrentSession = false }: { session: Session; isCurrentSession?: boolean }) {
	const { refetch } = authClient.useSession();
	const router = useRouter();
	const format = useFormatter();
	const t = useTranslations("Account.tabs.sessions");
	// Safely parse the stored user-agent JSON (if present). We avoid throwing on malformed JSON.
	const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;

	function getBrowserInformation() {
		if (userAgentInfo == null) return t("unknown_device");
		const browserName = userAgentInfo?.browser?.name ?? null;
		const osName = userAgentInfo?.os?.name ?? null;

		if (browserName && osName) return `${browserName}, ${osName}`;
		if (browserName) return browserName;
		if (osName) return osName;
		return t("unknown_device");
	}

	function getDeviceIcon() {
		const deviceType = userAgentInfo?.device?.type ?? "desktop";
		switch (deviceType) {
			case "mobile":
				return <Smartphone aria-hidden className="h-6 w-6 text-muted-foreground" />;
			case "tablet":
				return <Tablet aria-hidden className="h-6 w-6 text-muted-foreground" />;
			default:
				return <Monitor aria-hidden className="h-6 w-6 text-muted-foreground" />;
		}
	}

	const [revokeSession, { isLoading }] = useBetterAuthFunction(authClient.revokeSession, {
		errorMessage: t("errors.revokeSession"),
		loadingMessage: t("messages.processing"),
		onSuccess: () => {
			refetch();
			router.refresh();
		},
		successMessage: t("messages.sessionRevoked"),
	});

	return (
		<Item variant="outline">
			<ItemMedia variant="icon">{getDeviceIcon()}</ItemMedia>
			<ItemContent>
				<ItemTitle className="flex flex-col items-start">
					<p className="space-x-4 text-muted-foreground text-sm">
						<Badge variant="outline">{userAgentInfo?.device?.model ?? userAgentInfo?.device?.type ?? t("unknown_device_type")}</Badge>
						<span>{session.ipAddress || t("unknown_ip")}</span>
					</p>
					<Badge variant="outline">{getBrowserInformation()}</Badge>
				</ItemTitle>
				<ItemDescription className="flex items-start gap-4 sm:items-center sm:gap-12">
					<div className="min-w-0">
						<p className="text-muted-foreground text-sm">{t("created")}</p>
						<p className="text-sm">{format.dateTime(session.createdAt, "short")}</p>
					</div>

					<div className="min-w-0">
						<p className="text-muted-foreground text-sm">{t("expires")}</p>
						<p className="text-sm">{format.dateTime(session.expiresAt, "short")}</p>
					</div>
				</ItemDescription>
			</ItemContent>
			<ItemActions>
				{isCurrentSession ? (
					<Badge aria-label={t("current_session_aria")}>{t("current_session")}</Badge>
				) : (
					<ActionButton
						aria-label={t("revoke_aria", { id: session.id })}
						buttonIcon={<Trash2 />}
						disabled={isLoading}
						onClick={() => revokeSession({ token: session.token })}
						size="icon"
						variant="borderedDestructive"
					/>
				)}
			</ItemActions>
		</Item>
	);
}
