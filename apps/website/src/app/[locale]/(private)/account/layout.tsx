import { Avatar, AvatarFallback, AvatarImage, Badge, Tabs, TabsList, TabsTrigger } from "@visionarai-one/ui";
import { User } from "lucide-react";
import { headers } from "next/headers";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { ImpersonationIndicator } from "@/widgets/auth/impersonation-indicator";
import { PageHeader } from "@/widgets/page-header";
import { ALL_TABS, getTabDetails } from "./_state/search-params";

type AccountLayoutProps = LayoutProps<"/[locale]/account">;

export default async function AccountLayout({ children }: AccountLayoutProps) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new Error("No session found");
	return (
		<>
			<PageHeader subtitle="Manage your account settings and set e-mail preferences." title="Account">
				<ImpersonationIndicator />

				<div className="flex items-center space-x-4">
					<Avatar className="size-16 rounded-lg">
						<AvatarImage alt={session.user.name || "User Avatar"} src={session.user.image || undefined} />
						<AvatarFallback>
							<User size={40} />
						</AvatarFallback>
					</Avatar>

					<div className="flex-1">
						<div className="flex items-start justify-between gap-1">
							<h1 className="font-bold text-3xl">{session.user.name || "User Profile"}</h1>
							<Badge>{session.user.role}</Badge>
						</div>
						<p className="text-muted-foreground">{session.user.email}</p>
					</div>
				</div>
			</PageHeader>
			<Tabs defaultValue="account">
				<TabsList className="w-full">
					{ALL_TABS.map((tab) => {
						const tabDetails = getTabDetails(tab);

						return (
							<TabsTrigger key={tab} value={tab}>
								<Link className="flex items-center justify-center gap-2" href={{ pathname: "/account/profile" }} replace scroll={false}>
									{tabDetails.icon} {tabDetails.title}
								</Link>
							</TabsTrigger>
						);
					})}
				</TabsList>
			</Tabs>
			{children}
		</>
	);
}
