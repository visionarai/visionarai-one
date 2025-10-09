import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { PageHeader } from "@/widgets/page-header";
import { RegisterNewUser } from "./_components/register-new-user";
import UserManagementTable from "./_components/table";
export type PaginationData = {
	currentPage: number;
	from: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	nextOffset: number;
	pageNumbers: (number | "ellipsis")[];
	previousOffset: number;
	to: number;
	totalPages: number;
};

export default async function UserManagementPage() {
	const t = await getTranslations("UserManagement.page");

	const adminUsersList = await auth.api.listUsers({
		headers: await headers(),
		query: {},
	});

	if (!adminUsersList.users) {
		throw new Error("Failed to fetch users");
	}

	return (
		<section className="space-y-8">
			<PageHeader subtitle={t("description")} title={t("title")}>
				<RegisterNewUser />
			</PageHeader>

			<UserManagementTable initialData={adminUsersList} />
		</section>
	);
}
