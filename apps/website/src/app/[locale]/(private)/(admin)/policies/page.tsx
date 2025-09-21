import { examplePolicy } from "@visionarai-one/abac";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	DataDebugger,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@visionarai-one/ui";
import { Pencil } from "lucide-react";
import { orpcRouterClient } from "@/lib/orpc";
import { ConditionTree } from "./_condition-tree";
export default async function PoliciesPage() {
	await orpcRouterClient.masterData.get();
	const policies = [examplePolicy];
	return (
		<div>
			<h1>Policies</h1>
			<DataDebugger data={{ policies }} />
			{policies.map((policy) => {
				const resources = Object.keys(policy.permissions);
				return (
					<Card className="mb-4" key={policy._id}>
						<CardHeader>
							<CardTitle>{policy.name}</CardTitle>
							<CardDescription>{policy.description}</CardDescription>
						</CardHeader>
						<CardContent>
							{resources.length === 0 ? (
								<p className="text-muted-foreground text-sm">No resources defined in this policy.</p>
							) : (
								resources.map((resource) => {
									const resourcePermissions = policy.permissions[resource as keyof typeof policy.permissions];
									return (
										<Table className="mb-4" key={resource}>
											<TableHeader>
												<TableRow>
													<TableHead className="bg-muted/50 font-semibold" colSpan={4}>
														Resource — {resource}
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
													<TableRow key={action}>
														<TableCell className="font-medium">{action}</TableCell>
														<TableCell>
															<Badge variant="outline">{permission.decision}</Badge>
														</TableCell>
														<TableCell>{permission.decision === "CONDITIONAL" ? <ConditionTree conditions={permission.condition} /> : "-"}</TableCell>
														<TableCell className="sticky right-0 z-10 text-right">
															<Button aria-label={`Edit ${action}`} size="icon" variant="outline">
																<Pencil />
															</Button>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									);
								})
							)}
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}

// Replaced inline tree view with shared UI component `ConditionTree`.
