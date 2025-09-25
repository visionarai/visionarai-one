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
		</section>
	);
}
