"use client";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Badge,
	Button,
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@visionarai-one/ui";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { querySearchParams, serializeUrl } from "../_state/search-params";
import { Toolbar } from "./toolbar";
import { UserActions } from "./user-actions";
export type PaginationData = {
	currentPage: number;
	from: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	nextOffset: number;
	pageNumbers: (number | "ellipsis")[];
	previousOffset: number;
	to: number;
	totalPages: number;
};

type ListUsersResponse = Awaited<ReturnType<typeof auth.api.listUsers>>;

type UserManagementTableProps = {
	initialData: ListUsersResponse;
};

export default function UserManagementTable({ initialData }: UserManagementTableProps) {
	const [{ query }, setQueryStates] = useQueryStates(querySearchParams);
	const [adminUsersList, setAdminUsersList] = useState(initialData);

	const hasFetchedInitial = useRef(false);

	useEffect(() => {
		let isMounted = true;
		const fetchData = async () => {
			const returned = await authClient.admin.listUsers({ query });

			if (isMounted && returned?.data?.users) {
				setAdminUsersList(returned.data);
			}
		};

		if (hasFetchedInitial.current) {
			fetchData();
		}
		hasFetchedInitial.current = true;

		return () => {
			isMounted = false;
		};
	}, [query]);

	const tData = useTranslations("UserManagement.dataTable");

	if (!adminUsersList.users) {
		throw new Error("Failed to fetch users");
	}

	const total = adminUsersList.total || 0;
	const paginationData: PaginationData = calculatePagination(query.offset ?? 0, query.limit ?? 10, total);

	return (
		<Table className="rounded border">
			<TableHeader className="bg-muted p-32">
				<Toolbar />
				<TableRow className="text-md">
					<TableHead className="w-[100px]">{tData("avatar")}</TableHead>
					<TableHead>
						<Button
							onClick={() => setQueryStates({ query: { ...query, sortBy: "name", sortDirection: query.sortDirection === "asc" ? "desc" : "asc" } })}
							size="icon-lg"
							variant="ghost"
						>
							{tData("name")} {query.sortBy === "name" && (query.sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />)}
						</Button>
					</TableHead>
					<TableHead>
						<Button
							onClick={() => setQueryStates({ query: { ...query, sortBy: "email", sortDirection: query.sortDirection === "asc" ? "desc" : "asc" } })}
							size="icon-lg"
							variant="ghost"
						>
							{tData("email")} {query.sortBy === "email" && (query.sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />)}
						</Button>
					</TableHead>

					<TableHead className="text-right">{tData("actions")}</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody className="h-full">
				{adminUsersList.users.length === 0 ? (
					<TableRow>
						<TableCell className="h-24 text-center" colSpan={5}>
							<div className="flex flex-col items-center justify-center gap-2 py-8">
								<p className="font-semibold text-lg">{tData("empty.title")}</p>
								<p className="text-muted-foreground text-sm">{tData("empty.description")}</p>
							</div>
						</TableCell>
					</TableRow>
				) : (
					adminUsersList.users.map((user) => (
						<TableRow key={user.id}>
							<TableCell>
								<Avatar className="relative size-10">
									<AvatarImage alt={user.name || tData("unknownUser")} src={user.image || ""} />
									<AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
								</Avatar>
							</TableCell>
							<TableCell className="font-medium">
								{user.name || tData("unknownUser")}
								<div className="mt-1 flex items-center gap-2">
									{user.role === "admin" && <Badge variant="secondary">Admin</Badge>}
									{user.banned && <Badge variant="destructive">Banned</Badge>}
									{!user.emailVerified && <Badge variant="destructiveOutline">Unverified</Badge>}
								</div>
							</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell className="text-right">
								<UserActions user={user} />
							</TableCell>
						</TableRow>
					))
				)}
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell colSpan={5}>
						<div className="flex items-center justify-between">
							<div className="text-muted-foreground text-sm">
								{total ? (
									tData("pagination.showing", {
										from: paginationData.from,
										to: paginationData.to,
										total,
									})
								) : (
									<span>&nbsp;</span>
								)}
							</div>
							<div className="flex items-center gap-2">
								<Button asChild className={paginationData.hasPreviousPage ? "" : "pointer-events-none opacity-50"} variant="ghost">
									<Link href={serializeUrl(query, { offset: paginationData.previousOffset })}>
										<ChevronLeft />
										{tData("pagination.previous")}
									</Link>
								</Button>

								{paginationData.pageNumbers.map((pageNumber) => {
									if (pageNumber === "ellipsis") {
										return (
											<span className="px-2" key={"ellipsis"}>
												&hellip;
											</span>
										);
									}

									const isActive = pageNumber === paginationData.currentPage;
									return (
										<Button asChild className={isActive ? "pointer-events-none" : ""} key={pageNumber} variant={isActive ? "default" : "ghost"}>
											<Link href={serializeUrl(query, { offset: (pageNumber - 1) * (query.limit ?? 10) })}>{pageNumber}</Link>
										</Button>
									);
								})}

								<Button asChild className={paginationData.hasNextPage ? "" : "pointer-events-none opacity-50"} variant="ghost">
									<Link href={serializeUrl(query, { offset: paginationData.nextOffset })}>
										{tData("pagination.next")}
										<ChevronRight />
									</Link>
								</Button>
							</div>
						</div>
					</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	);
}

const calculatePagination = (offset: number, limit: number, total: number): PaginationData => {
	const currentPage = Math.floor(offset / limit) + 1;
	const totalPages = Math.ceil(total / limit);
	const from = offset + 1;
	const to = Math.min(offset + limit, total);
	const hasPreviousPage = currentPage > 1;
	const hasNextPage = currentPage < totalPages;
	const previousOffset = hasPreviousPage ? offset - limit : 0;
	const nextOffset = hasNextPage ? offset + limit : offset;

	// Generate page numbers with ellipsis
	const pageNumbers: (number | "ellipsis")[] = [];
	if (totalPages <= 7) {
		for (let i = 1; i <= totalPages; i++) {
			pageNumbers.push(i);
		}
	} else {
		pageNumbers.push(1);
		if (currentPage > 4) {
			pageNumbers.push("ellipsis");
		}
		for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
			pageNumbers.push(i);
		}
		if (currentPage < totalPages - 3) {
			pageNumbers.push("ellipsis");
		}
		pageNumbers.push(totalPages);
	}

	return {
		currentPage,
		from,
		hasNextPage,
		hasPreviousPage,
		nextOffset,
		pageNumbers,
		previousOffset,
		to,
		totalPages,
	};
};
