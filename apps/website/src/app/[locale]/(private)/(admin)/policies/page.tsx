import { ErrorAlert } from "@visionarai-one/ui";
import { getLocale, getTranslations } from "next-intl/server";
import { safeOrpcClient } from "@/lib/orpc";
import { PageHeader } from "@/widgets/page-header";
import { CreateNewPolicy, EmptyState, formatNumber, PolicyCard } from "./_components";

export default async function PoliciesPage() {
	const t = await getTranslations("PoliciesPage");
	const locale = await getLocale();

	const [masterDataError] = await safeOrpcClient.masterData.get();
	const [policiesError, policies] = await safeOrpcClient.policies.getAll();

	const policiesList = policies ?? [];
	const policiesCount = policiesList.length;
	const hasPolicies = policiesCount > 0;

	return (
		<section className="space-y-6">
			<PageHeader subtitle={t("subtitle")} title={t("title")}>
				<div className="flex items-center gap-2">
					<span className="text-muted-foreground text-sm">
						{formatNumber(policiesCount, locale)} {policiesCount === 1 ? "policy" : "policies"}
					</span>
					<CreateNewPolicy />
				</div>
			</PageHeader>

			{masterDataError ? <ErrorAlert description={t("errors.masterData")} details={masterDataError.message} /> : null}
			{policiesError ? <ErrorAlert description={t("errors.policies")} details={policiesError.message} /> : null}

			{hasPolicies ? (
				<div className="space-y-4">
					{policiesList.map((policy, index) => (
						<PolicyCard index={index} key={policy._id?.toString() ?? `policy-${index}`} locale={locale} policy={policy} />
					))}
				</div>
			) : (
				<EmptyState actionText={t("empty.action")} description={t("empty.description")} title={t("empty.title")} />
			)}
		</section>
	);
}
