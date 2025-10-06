import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import type { SearchParams } from "nuqs/server";
import { auth, type User, type UserSession } from "@/lib/auth";
import { DataTable } from "./_components/data-table";
import { searchParamsCache } from "./_state/search-params";

type UserManagementPageProps = {
	searchParams: Promise<SearchParams>;
};

export default async function UserManagementPage({ searchParams }: UserManagementPageProps) {
	const { query } = await searchParamsCache.parse(searchParams);

	const t = await getTranslations("UserManagement.page");

	const adminUsersList = await auth.api.listUsers({
		headers: await headers(),
		query,
	});

	if (!adminUsersList.users) {
		throw new Error("Failed to fetch users");
	}

	const allUsersWithSessions: { user: User; sessions: UserSession[] }[] = await Promise.all(
		(adminUsersList.users ?? []).map(async (user) => {
			const sessions = await fetchSessionForUser(user.id.toString());
			return {
				sessions: sessions ?? [],
				user: user as User,
			};
		})
	);

	const total = allUsersWithSessions.length;
	return (
		<section className="space-y-8">
			<div>
				<h1 className="font-bold text-2xl">{t("title")}</h1>
				<p className="text-muted-foreground">{t("description")}</p>
			</div>
			<DataTable data={allUsersWithSessions} totalCountInDb={total} />
		</section>
	);
}

async function fetchSessionForUser(userId: string) {
	const data = await auth.api.listUserSessions({
		body: { userId },
		headers: await headers(),
	});
	return data.sessions ?? [];
}
