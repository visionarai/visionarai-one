import { getTranslations } from "next-intl/server";
import { orpcClient } from "@/lib/orpc";
import { PageHeader } from "@/widgets/page-header";
import MasterDataForm from "./_master_data_form";
export default async function MasterPage() {
	const t = await getTranslations("MasterData.page");

	const defaultValues = await orpcClient.masterData.get();

	return (
		<section className="space-y-8">
			<PageHeader subtitle={t("subtitle")} title={t("title")} />
			<MasterDataForm defaultValues={defaultValues} />
		</section>
	);
}
