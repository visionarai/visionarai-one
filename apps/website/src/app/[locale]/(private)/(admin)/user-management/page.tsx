import { headers } from "next/headers";
// import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
export default async function UserManagementPage() {
	// const t = await getTranslations("UserManagement.page");

	const fetchedUserList = await auth.api.listUsers({
		headers: await headers(),
		query: {},
	});

	const allUsersWithSessions = await Promise.all(
		(fetchedUserList.users ?? []).map(async (user) => {
			const sessions = await fetchSessionForUser(user.id.toString());
			return {
				...user,
				sessions,
			};
		})
	);

	return (
		<section className="space-y-8">
			<pre>{JSON.stringify(allUsersWithSessions, null, 2)}</pre>
		</section>
	);
}

async function fetchSessionForUser(userId: string) {
	const data = await auth.api.listUserSessions({
		body: { userId },
		headers: await headers(),
	});
	return data;
}
