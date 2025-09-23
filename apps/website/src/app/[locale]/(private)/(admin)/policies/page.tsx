import type { PermissionType } from "@visionarai-one/abac";
import { examplePolicy } from "@visionarai-one/abac";
import {
	Badge,
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
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@visionarai-one/ui";
import { ChevronLeft, Maximize2, Minus, UnfoldVertical } from "lucide-react";
import { orpcRouterClient } from "@/lib/orpc";
import { decisionBorderColor } from "./_colors";
import { ConditionTree } from "./_condition-tree";
import { PermissionForm } from "./_permission_form";

async function loadMasterData() {
	await orpcRouterClient.masterData.get();
}

type PermissionRowSheetProps = React.ComponentPropsWithoutRef<"div"> & {
	id: string;
	resource: string;
	action: string;
	permission: PermissionType;
};

function PermissionEditorSheet({ action, permission, resource, id }: PermissionRowSheetProps) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button aria-label={`Edit ${action}`} size="icon" variant="outline">
					<Maximize2 />
				</Button>
			</SheetTrigger>
			<SheetContent className="w-screen md:w-[calc(100vw-160px)]" side="right">
				<SheetHeader>
					<SheetTitle className="mb-2 flex items-center gap-4">
						<SheetClose asChild>
							<ChevronLeft />
						</SheetClose>
						<span className="font-semibold text-lg">Edit Permission</span>
						<div className="flex items-center">
							<Badge variant="secondary">{resource}</Badge>
							<Minus className="rotate-90 transform" />
							<Badge variant="secondary">{action}</Badge>
						</div>
					</SheetTitle>
					<SheetDescription>Make changes to the permission here. Click Submit when you&apos;re done.</SheetDescription>
				</SheetHeader>

				<div className="h-full w-full overflow-y-auto px-8">
					<PermissionForm action={action} id={id} permission={permission} resource={resource} />
				</div>
				<SheetFooter>
					<SheetClose asChild>
						<Button form="permission-form" type="submit">
							Submit
						</Button>
					</SheetClose>
					<SheetClose asChild>
						<Button variant="outline">Close</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}

function PermissionRow({ action, permission, resource, id }: PermissionRowSheetProps) {
	return (
		<TableRow key={action}>
			<TableCell className="font-medium">{action}</TableCell>
			<TableCell>
				<Badge className={decisionBorderColor(permission.decision)} variant="outline">
					{permission.decision}
				</Badge>
			</TableCell>
			<TableCell>{permission.decision === "CONDITIONAL" ? <ConditionTree conditions={permission.condition} /> : "-"}</TableCell>
			<TableCell className="sticky right-0 z-10 text-right">
				<PermissionEditorSheet action={action} id={id} permission={permission} resource={resource} />
			</TableCell>
		</TableRow>
	);
}

export default async function PoliciesPage() {
	await loadMasterData();
	const policies = [examplePolicy];

	return (
		<div>
			{policies.map((policy, index) => {
				const resources = Object.keys(policy.permissions);
				return (
					<Card className="mb-4" key={policy._id}>
						<Collapsible>
							<CardHeader>
								<CardTitle>
									{index + 1}. {policy.name} - v{policy.version}
								</CardTitle>
								<CardAction>
									<CollapsibleTrigger asChild>
										<Button size="icon" variant="outline">
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
												<Table className="mb-4" key={resource}>
													<TableHeader>
														<TableRow>
															<TableHead className="bg-muted/50 font-semibold" colSpan={4}>
																Resource  {resource}
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
