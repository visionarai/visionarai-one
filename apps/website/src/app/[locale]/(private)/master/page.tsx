import MasterDataForm from "./_master_data_form";

export default function MasterPage() {
	return (
		<div>
			Master Page
			<MasterDataForm
				defaultValues={{
					_id: "64b8f3f4f1d2c4a5b6c7d8e9",
					createdAt: new Date("2024-07-20T10:00:00Z"),
					resources: [
						{
							attributes: [
								{ key: "department", type: "string" },
								{
									key: "createdAt",
									type: "Date",
								},
							],
							name: "documents",
							permissions: ["read", "write"],
						},
						{
							attributes: [
								{ key: "role", type: "string" },
								{ key: "isActive", type: "boolean" },
							],
							name: "users",
							permissions: ["view", "edit", "delete"],
						},
					],
					updatedAt: new Date("2024-07-20T10:00:00Z"),
				}}
			/>
		</div>
	);
}
