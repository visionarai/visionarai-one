import type { ResourceType } from "@visionarai-one/abac";
import { Card, CardContent, CardHeader, CardTitle } from "@visionarai-one/ui";
import { Database } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { orpcClient } from "@/lib/orpc";
import MasterDataForm from "./_master_data_form";

export default async function MasterPage() {
	const t = await getTranslations("MasterData.page");

	const defaultValues = await orpcClient.masterData.get();

	return (
		<section className="space-y-8">
			<header className="space-y-3">
				<h1 className="font-semibold text-3xl tracking-tight">{t("title")}</h1>
				<p className="max-w-2xl text-lg text-muted-foreground">{t("subtitle")}</p>
			</header>
			<MasterDataForm defaultValues={defaultValues} />

			{defaultValues?.resources?.length && (
				<section className="space-y-6">
					<h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Snapshot</h3>
					<ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{defaultValues?.resources?.map((res) => (
							<li key={res.name}>
								<ResourceRow resource={res} />
							</li>
						))}
					</ul>
				</section>
			)}
		</section>
	);
}

type ResourceRowProps = {
	resource: ResourceType;
};

function ResourceRow({ resource }: ResourceRowProps) {
	return (
		<Card className="transition-all duration-200 hover:shadow-md">
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 text-base">
					<Database className="h-4 w-4 text-muted-foreground" />
					{resource.name}
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-0">
				{resource.attributes && resource.attributes.length > 0 && (
					<ul className="space-y-1">
						{resource.attributes.map((attr) => (
							<li className="flex items-center justify-between rounded-md bg-muted/30 px-2 py-1 text-xs" key={attr.key}>
								<span className="font-medium text-foreground/80">{attr.key}</span>
								<span className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">{attr.type}</span>
							</li>
						))}
					</ul>
				)}
				{resource.permissions && resource.permissions.length > 0 && (
					<div className="mt-3 flex flex-wrap gap-1">
						{resource.permissions.map((perm) => (
							<span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs" key={perm}>
								{perm}
							</span>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
