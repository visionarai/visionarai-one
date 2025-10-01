"use client";

import type { PersistedPolicy } from "@visionarai-one/abac";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Badge, Card, CardContent, CardHeader } from "@visionarai-one/ui";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { PermissionsList } from "./permissions-list";
import { PolicyActions } from "./policy-actions";
import { formatDateTime } from "./utils";

type PolicyCardProps = {
	index: number;
	locale: string;
	policy: PersistedPolicy;
};

export const PolicyCard = ({ index, locale, policy }: PolicyCardProps) => {
	const t = useTranslations("PoliciesPage");
	const policyId = policy._id?.toString() ?? "";
	const resourceEntries = Object.entries(policy.permissions ?? {});
	const resourceCount = resourceEntries.length;
	const actionCount = resourceEntries.reduce((sum, [, actions]) => sum + Object.keys(actions ?? {}).length, 0);
	const updatedAtLabel = formatDateTime(policy.updatedAt, locale);
	const description = policy.description ?? t("policy.missingDescription");

	return (
		<Card className="group transition-shadow hover:shadow-md">
			<Accordion collapsible type="single">
				<AccordionItem className="border-0" value="policy-details">
					<CardHeader className="space-y-0 pb-3">
						<div className="flex items-start justify-between gap-4">
							<div className="min-w-0 flex-1 space-y-1">
								<div className="flex items-center gap-2">
									<h3 className="font-semibold text-base">
										{index + 1}. {policy.name}
									</h3>
									<Badge className="shrink-0" variant="secondary">
										v{policy.version}
									</Badge>
								</div>
								<p className="text-muted-foreground text-sm">{description}</p>
							</div>
							<div className="flex items-center gap-1">
								<PolicyActions policyId={policyId} policyName={policy.name} />
								<AccordionTrigger className="hover:no-underline [&[data-state=open]>svg]:rotate-180">
									<span className="sr-only">Toggle policy details</span>
								</AccordionTrigger>
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-3 pt-3 text-xs">
							<div className="flex items-center gap-1.5 text-muted-foreground">
								<span className="font-medium">{t("policy.meta.resources", { count: resourceCount })}</span>
								<ChevronRight className="h-3 w-3" />
								<span className="font-medium">{t("policy.meta.actions", { count: actionCount })}</span>
							</div>
							{updatedAtLabel ? <span className="text-muted-foreground">{t("policy.updated", { updatedAt: updatedAtLabel })}</span> : null}
						</div>
					</CardHeader>

					<AccordionContent>
						{resourceEntries.length > 0 ? (
							<CardContent className="space-y-4 pt-0">
								{resourceEntries.map(([resource, resourcePermissions]) => (
									<PermissionsList key={resource} policyId={policyId} resource={resource} resourcePermissions={resourcePermissions} />
								))}
							</CardContent>
						) : (
							<CardContent className="pt-0">
								<p className="text-muted-foreground text-sm">{t("table.noResources")}</p>
							</CardContent>
						)}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</Card>
	);
};
