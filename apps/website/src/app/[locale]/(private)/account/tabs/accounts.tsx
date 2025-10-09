import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@visionarai-one/ui";
import type { auth } from "@/lib/auth";
import { SUPPORTED_OAUTH_PROVIDERS } from "@/lib/o-auth-providers";

type Account = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number];

function formatDate(date?: string | Date | null) {
	if (!date) return "-";
	const d = typeof date === "string" ? new Date(date) : date;
	try {
		return d.toLocaleString();
	} catch {
		return String(d);
	}
}

type AccountsTabProps = {
	accounts?: Account[];
};

export default function AccountsTab({ accounts }: AccountsTabProps) {
	if (!accounts || accounts.length === 0) {
		return (
			<div className="py-8">
				<Card>
					<CardHeader>
						<CardTitle>No linked accounts</CardTitle>
						<CardDescription>You haven't connected any external accounts yet.</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground text-sm">Connect providers like GitHub or Google to sign in faster.</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="py-6">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{accounts.map((account) => (
					<Card className="h-full" key={account.id}>
						<CardHeader>
							<div>
								<CardTitle>{account.providerId?.toUpperCase() ?? account.providerId}</CardTitle>
								<CardDescription className="truncate">{account.accountId}</CardDescription>
							</div>
						</CardHeader>

						<CardContent>
							<div className="flex flex-col gap-4">
								<div className="flex flex-wrap gap-2">
									{account.scopes && account.scopes.length > 0 ? (
										account.scopes.map((s) => (
											<Badge className="text-xs" key={s} variant="secondary">
												{s}
											</Badge>
										))
									) : (
										<span className="text-muted-foreground text-sm">No scopes</span>
									)}
								</div>

								<dl className="grid grid-cols-2 gap-2 text-sm">
									<div>
										<dt className="text-muted-foreground">Created</dt>
										<dd className="font-medium">{formatDate(account.createdAt)}</dd>
									</div>
									<div>
										<dt className="text-muted-foreground">Updated</dt>
										<dd className="font-medium">{formatDate(account.updatedAt)}</dd>
									</div>
								</dl>
							</div>
						</CardContent>

						<CardFooter>
							<div className="ml-auto">
								<Button disabled size="sm" title="Unlink coming soon" variant="destructive">
									Unlink
								</Button>
							</div>
						</CardFooter>
					</Card>
				))}
			</div>{" "}
			<div className="space-y-2">
				<h3 className="font-medium text-lg">Link Other Accounts</h3>

				<div className="grid gap-3">
					{SUPPORTED_OAUTH_PROVIDERS.filter((provider) => !accounts.find((acc) => acc.providerId === provider)).map((provider) => (
						<Card className="h-full" key={provider}>
							<CardHeader>
								<div>
									<CardTitle>{provider.toUpperCase()}</CardTitle>
									<CardDescription className="truncate">Not linked</CardDescription>
								</div>
							</CardHeader>

							<CardContent>
								<p className="text-muted-foreground text-sm">Link your {provider} account to enable social login.</p>
							</CardContent>

							<CardFooter>
								<div className="ml-auto">
									<Button disabled size="sm" title="Unlink coming soon" variant="destructive">
										Link
									</Button>
								</div>
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
