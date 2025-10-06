// Placeholder for user actions - to be implemented later
type UserActionsProps = {
	userId: string;
};

export function UserActions({ userId }: UserActionsProps) {
	return (
		<div className="flex justify-end space-x-2">
			{/* Add action buttons here later */}
			<span className="text-muted-foreground text-sm">Actions for {userId}</span>
		</div>
	);
}
