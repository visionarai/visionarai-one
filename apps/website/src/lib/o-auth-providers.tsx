import { GitHubIcon, GmailIcon } from "@visionarai-one/ui";
import type { ComponentProps, ElementType } from "react";

export const SUPPORTED_OAUTH_PROVIDERS = ["github", "gmail"] as const;
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

export type OAuthProviderDetails = {
	name: "GitHub" | "Google";
	Icon: ElementType<ComponentProps<"svg">>;
	signInKey: "signInWithGitHub" | "signInWithGmail";
};

export const SUPPORTED_OAUTH_PROVIDER_DETAILS: Record<SupportedOAuthProvider, OAuthProviderDetails> = {
	github: { Icon: GitHubIcon, name: "GitHub", signInKey: "signInWithGitHub" },
	gmail: { Icon: GmailIcon, name: "Google", signInKey: "signInWithGmail" },
};
