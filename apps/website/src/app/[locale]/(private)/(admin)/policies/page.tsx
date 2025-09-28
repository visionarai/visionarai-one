import {
	Badge,
	Button,
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@visionarai-one/ui";
import { AlertTriangle, ChevronDown, Plus } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { safeOrpcClient } from "@/lib/orpc";
import { PageHeader } from "@/widgets/page-header";
import { CreateNewPolicy } from "./_create-new-policy";
import { PermissionRow } from "./_permission-row";
import { PolicyActions } from "./_policy-actions";

const formatDateTime = (value: Date | string | undefined, locale: string) => {
	if (!value) {
		return "";
	}
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) {
		return "";
	}
	return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
};

type ErrorNoticeProps = {
	description: string;
	details?: string;
	title: string;
};

const ErrorNotice = ({ description, details, title }: ErrorNoticeProps) => (
	<Card className="border-destructive/40 bg-destructive/5">
		<CardHeader className="gap-2">
			<div className="flex items-center gap-2 text-destructive">
				<AlertTriangle aria-hidden className="h-5 w-5" />
				<CardTitle className="text-destructive">{title}</CardTitle>
			</div>
			<CardDescription className="text-destructive/80">{description}</CardDescription>
		</CardHeader>
		{details ? (
			<CardContent>
				<p className="text-destructive/80 text-sm">{details}</p>
			</CardContent>
		) : null}
	</Card>
);

export default async function PoliciesPage() {
	const t = await getTranslations("PoliciesPage");
	const locale = await getLocale();
	const [masterDataError, masterData] = await safeOrpcClient.masterData.get();
	const [policiesError, policies] = await safeOrpcClient.policies.getAll();
	const policiesList = policies ?? [];

	const policiesCount = policiesList.length;

	const formatNumber = (value: number) => new Intl.NumberFormat(locale).format(value);

	const hasPolicies = policiesCount > 0;
	const shouldShowEmptyState = policiesCount === 0;

	return (
		<section className="space-y-8">
			<PageHeader subtitle={t("subtitle")} title={t("title")}>
				<Badge variant="outline">
					{formatNumber(policiesCount)} {t("summary.metrics.policies.label")}
				</Badge>
				<Badge variant="outline">
					{masterData?.resources.length ?? 0} {t("summary.metrics.resources.label")}
				</Badge>
				<CreateNewPolicy />
			</PageHeader>

			{masterDataError ? <ErrorNotice description={t("errors.masterData")} details={masterDataError.message} title={t("errors.genericTitle")} /> : null}
			{policiesError ? <ErrorNotice description={t("errors.policies")} details={policiesError.message} title={t("errors.genericTitle")} /> : null}

			{shouldShowEmptyState ? (
				<Card className="border-dashed">
					<CardHeader className="gap-2 text-center">
						<CardTitle>{t("empty.title")}</CardTitle>
						<CardDescription>{t("empty.description")}</CardDescription>
					</CardHeader>
					<CardContent className="flex justify-center">
						<Button asChild size="sm">
							<Link href="?createNewDialogOpen=true">
								<Plus className="mr-2 h-4 w-4" />
								{t("empty.action")}
							</Link>
						</Button>
					</CardContent>
				</Card>
			) : null}

			{hasPolicies ? (
				<div className="space-y-6">
					{policiesList.map((policy, index) => {
						const policyId = policy._id?.toString() ?? "";
						const resourceEntries = Object.entries(policy.permissions ?? {});
						const resourceCount = resourceEntries.length;
						const actionCount = resourceEntries.reduce((sum, [, actions]) => sum + Object.keys(actions ?? {}).length, 0);
						const updatedAtLabel = formatDateTime(policy.updatedAt, locale);
						const description = policy.description ?? t("policy.missingDescription");

						return (
							<Card key={policyId || `${policy.name}-${index}`}>
								<Collapsible defaultOpen={index === 0}>
									<CardHeader className="gap-3">
										<div className="space-y-2">
											<div className="flex flex-wrap items-center gap-2">
												<CardTitle className="font-semibold text-lg">
													{index + 1}. {policy.name}
												</CardTitle>
												<Badge variant="secondary">{t("policy.version", { version: policy.version })}</Badge>
											</div>
											<CardDescription>{description}</CardDescription>
										</div>
										<CardAction className="flex items-center gap-2">
											<PolicyActions policyId={policyId} policyName={policy.name} />
											<CollapsibleTrigger asChild>
												<Button aria-label={t("actions.toggleDetails")} size="icon" variant="ghost">
													<ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
												</Button>
											</CollapsibleTrigger>
										</CardAction>
									</CardHeader>
									<CollapsibleContent>
										<CardContent className="space-y-5">
											<div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
												<Badge variant="outline">{t("policy.meta.resources", { count: resourceCount })}</Badge>
												<Badge variant="outline">{t("policy.meta.actions", { count: actionCount })}</Badge>
												{updatedAtLabel ? <span>{t("policy.updated", { updatedAt: updatedAtLabel })}</span> : null}
											</div>
											{resourceEntries.length === 0 ? (
												<p className="text-muted-foreground text-sm">{t("table.noResources")}</p>
											) : (
												resourceEntries.map(([resource, resourcePermissions]) => {
													const resourceActionCount = Object.keys(resourcePermissions ?? {}).length;
													return (
														<div className="space-y-3" key={resource}>
															<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
																<div className="flex items-center gap-2">
																	<Badge variant="secondary">{resource}</Badge>
																	<span className="text-muted-foreground text-sm">{t("table.actionsCount", { count: resourceActionCount })}</span>
																</div>
															</div>
															<Table className="overflow-hidden rounded-2xl border">
																<TableHeader>
																	<TableRow>
																		<TableHead className="bg-muted/50 font-semibold">{t("table.headers.action")}</TableHead>
																		<TableHead className="bg-muted/50 font-semibold">{t("table.headers.decision")}</TableHead>
																		<TableHead className="bg-muted/50 font-semibold">{t("table.headers.condition")}</TableHead>
																		<TableHead className="sticky right-0 z-10 bg-muted/50 text-right font-semibold">{t("table.headers.actions")}</TableHead>
																	</TableRow>
																</TableHeader>
																<TableBody>
																	{Object.entries(resourcePermissions ?? {}).map(([action, permission]) => (
																		<PermissionRow action={action} id={policyId} key={action} permission={permission} resource={resource} />
																	))}
																</TableBody>
															</Table>
														</div>
													);
												})
											)}
										</CardContent>
									</CollapsibleContent>
								</Collapsible>
							</Card>
						);
					})}
				</div>
			) : null}
		</section>
	);
}
