import { Avatar, AvatarFallback, AvatarImage, Badge, Card, CardContent, CardHeader, Tabs, TabsContent, TabsList, TabsTrigger } from "@visionarai-one/ui";
import { User } from "lucide-react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ImpersonationIndicator } from "@/widgets/auth/impersonation-indicator";
import { PageHeader } from "@/widgets/page-header";

export default async function AccountPage() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new Error("No session found");
	return (
		<div>
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
			<Tabs defaultValue="profile">
				<Card className="mt-8">
					<CardHeader>
						<TabsList className="w-full">
							<TabsTrigger value="profile">Profile</TabsTrigger>
							<TabsTrigger value="security">Security</TabsTrigger>
							<TabsTrigger value="sessions">Sessions</TabsTrigger>
							<TabsTrigger value="danger-zone">Danger Zone</TabsTrigger>
						</TabsList>
					</CardHeader>
					<CardContent className="mx-6 bg-accent p-6">
						<TabsContent value="profile">
							<p>Profile content goes here.</p>
						</TabsContent>
						<TabsContent value="security">
							<p>Security content goes here.</p>
						</TabsContent>
						<TabsContent value="sessions">
							<p>Sessions content goes here.</p>
						</TabsContent>
						<TabsContent value="danger-zone">
							<p>Danger Zone content goes here.</p>
						</TabsContent>
					</CardContent>
				</Card>
			</Tabs>
		</div>
	);
}
