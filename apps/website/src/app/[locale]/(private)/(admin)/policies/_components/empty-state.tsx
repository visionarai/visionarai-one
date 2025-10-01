"use client";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@visionarai-one/ui";
import { FileText, Plus } from "lucide-react";
import { Link } from "@/i18n/navigation";

type EmptyStateProps = {
	actionText: string;
	description: string;
	title: string;
};

export const EmptyState = ({ actionText, description, title }: EmptyStateProps) => (
	<Card className="border-dashed">
		<CardHeader className="items-center gap-4 text-center">
			<div className="rounded-full bg-muted p-4">
				<FileText className="h-8 w-8 text-muted-foreground" />
			</div>
			<div className="space-y-2">
				<CardTitle className="text-xl">{title}</CardTitle>
				<CardDescription className="max-w-md">{description}</CardDescription>
			</div>
		</CardHeader>
		<CardContent className="flex justify-center pb-8">
			<Button asChild>
				<Link href="?createNewDialogOpen=true">
					<Plus className="mr-2 h-4 w-4" />
					{actionText}
				</Link>
			</Button>
		</CardContent>
	</Card>
);
