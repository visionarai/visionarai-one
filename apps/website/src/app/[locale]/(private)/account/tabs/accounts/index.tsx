import { ActionButton, Badge, Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle, Separator } from "@visionarai-one/ui";
import { Link, Unlink } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import type { auth } from "@/lib/auth";
import { getDetailsForProvider, SUPPORTED_OAUTH_PROVIDERS, type SupportedOAuthProvider } from "@/lib/o-auth-providers";

type Account = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number];

type AccountsTabProps = {
	accounts?: Account[];
};

export default async function AccountsTab({ accounts }: AccountsTabProps) {
	const format = await getFormatter();
	const t = await getTranslations("Account.tabs.accounts");
	if (!accounts || accounts.length === 0) {
		return (
			<section aria-labelledby="no-linked-accounts" className="space-y-4 py-6 text-muted-foreground">
				<h3 className="font-bold text-xl tracking-tight">{t("no_linked_accounts")}</h3>
				<p>
					{t("no_accounts_message.line1")}
					<br />
					{t("no_accounts_message.line2")}
				</p>

				<div className="grid xs:grid-cols-1 gap-3 sm:grid-cols-2">
					{SUPPORTED_OAUTH_PROVIDERS.map((provider) => (
						<NotLinkedAccountItem key={provider} provider={provider} />
					))}
				</div>
			</section>
		);
	}

	return (
		<section aria-labelledby="linked-accounts" className="space-y-8">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<h3 className="font-bold text-xl tracking-tight">{t("linked_accounts_heading")}</h3>
				<p className="text-muted-foreground text-sm">{t("linked_accounts_subtitle")}</p>
			</div>

			{accounts.map((account) => {
				const { Icon, name } = getDetailsForProvider(account.providerId as SupportedOAuthProvider);

				return (
					<Item className="h-full" key={account.id} variant="outline">
						<ItemMedia variant="icon">
							<Icon />
						</ItemMedia>
						<ItemContent>
							<ItemTitle>
								<span className="sr-only font-semibold text-lg">Provider:</span>
								{name}
							</ItemTitle>
							<ItemDescription className="flex flex-col gap-4">
								<div aria-hidden className="flex flex-wrap gap-2">
									{account.scopes && account.scopes.length > 0 ? (
										account.scopes.map((s) => (
											<Badge className="text-xs" key={s} variant="secondary">
												{s}
											</Badge>
										))
									) : (
										<span className="text-muted-foreground text-sm">{t("no_scopes")}</span>
									)}
								</div>

								<div className="flex gap-8 text-sm">
									<div>
										<span className="text-muted-foreground">{t("created")}</span>
										<br />
										<span className="font-medium">{format.dateTime(account.createdAt, "short")}</span>
									</div>
									<div>
										<span className="text-muted-foreground">{t("updated")}</span>
										<br />
										<span className="font-medium">{format.dateTime(account.updatedAt, "short")}</span>
									</div>
								</div>
							</ItemDescription>
						</ItemContent>
						<ItemActions>
							<ActionButton aria-label={t("aria.unlink_account", { provider: name })} buttonIcon={<Unlink />} labelAsText variant="borderedDestructive" />
						</ItemActions>
					</Item>
				);
			})}

			<Separator />
			<div className="space-y-2">
				<h2 className="font-semibold text-lg">{t("link_other_accounts")}</h2>

				<div className="grid xs:grid-cols-1 gap-3 sm:grid-cols-2">
					{SUPPORTED_OAUTH_PROVIDERS.filter((provider) => !accounts.find((acc) => acc.providerId === provider)).map((provider) => (
						<NotLinkedAccountItem key={provider} provider={provider} />
					))}
				</div>
			</div>
		</section>
	);
}
async function NotLinkedAccountItem({ provider }: { provider: SupportedOAuthProvider }) {
	const t = await getTranslations("Account.tabs.accounts");
	const { Icon, name } = getDetailsForProvider(provider);
	return (
		<Item className="h-full" key={provider} variant="outline">
			<ItemMedia variant="icon">
				<Icon className="h-6 w-6 text-muted-foreground" />
			</ItemMedia>
			<ItemContent>
				<ItemTitle>{name}</ItemTitle>
				<ItemDescription>{t("not_linked")}</ItemDescription>
			</ItemContent>
			<ItemActions>
				<ActionButton aria-label={t("aria.link_account", { provider: name })} buttonIcon={<Link />} variant="outline">
					{t("link_account")}
				</ActionButton>
			</ItemActions>
		</Item>
	);
}
