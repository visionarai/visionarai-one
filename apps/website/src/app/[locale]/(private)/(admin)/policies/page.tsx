import {
	ActionConfirmationButton,
	Button,
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@visionarai-one/ui";
import { Copy, UnfoldVertical } from "lucide-react";
import { safeOrpcClient } from "@/lib/orpc";
import { CreateNewPolicy } from "./_create-new-policy";
import { PermissionRow } from "./_permission-row";

export default async function PoliciesPage() {
	const [error, masterData] = await safeOrpcClient.masterData.get();
	const [policiesError, policies] = await safeOrpcClient.policies.getAll();
	return (
		<div>
			<CreateNewPolicy />
			{error && <p className="text-red-500">Error loading policies: {error.message}</p>}
			{policiesError && <p className="text-red-500">Error loading policies: {policiesError.message}</p>}
			{!masterData && <p className="text-muted-foreground">Loading master data...</p>}
			{policies?.map((policy, index) => {
				const resources = Object.keys(policy.permissions);
				return (
					<Card className="mb-4" key={policy._id.toString()}>
						<Collapsible>
							<CardHeader>
								<CardTitle>
									{index + 1}. {policy.name} - v{policy.version}
								</CardTitle>
								<CardAction>
									<ActionConfirmationButton variant="destructive" />
									<Button className="ml-2" size="icon" variant="ghost">
										<Copy />
									</Button>
									<CollapsibleTrigger asChild>
										<Button size="icon" variant="ghost">
											<UnfoldVertical />
										</Button>
									</CollapsibleTrigger>
								</CardAction>
								<CardDescription>{policy.description}</CardDescription>
							</CardHeader>
							<CollapsibleContent>
								<CardContent>
									{resources.length === 0 ? (
										<p className="text-muted-foreground text-sm">No resources defined in this policy.</p>
									) : (
										resources.map((resource) => {
											const resourcePermissions = policy.permissions[resource as keyof typeof policy.permissions];
											return (
												<Table className="my-4 rounded-2xl border-2" key={resource}>
													<TableHeader>
														<TableRow>
															<TableHead className="bg-muted/50 font-semibold" colSpan={4}>
																Resource: {resource}
															</TableHead>
														</TableRow>
														<TableRow>
															<TableHead className="font-bold">Action</TableHead>
															<TableHead className="font-bold">Decision</TableHead>
															<TableHead className="font-bold">Condition</TableHead>
															<TableHead className="sticky right-0 z-10 text-right font-bold">Actions</TableHead>
														</TableRow>
													</TableHeader>
													<TableBody>
														{Object.entries(resourcePermissions).map(([action, permission]) => (
															<PermissionRow action={action} id={policy._id} key={action} permission={permission} resource={resource} />
														))}
													</TableBody>
												</Table>
											);
										})
									)}
								</CardContent>
							</CollapsibleContent>
						</Collapsible>
					</Card>
				);
			})}
		</div>
	);
}
