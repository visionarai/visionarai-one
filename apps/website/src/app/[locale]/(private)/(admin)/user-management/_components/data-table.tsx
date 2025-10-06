import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@visionarai-one/ui";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { createSerializer } from "nuqs/server";
import { Link } from "@/i18n/navigation";
import type { User, UserSession } from "@/lib/auth";
import { type QueryType, querySearchParams, searchParamsCache } from "../_state/search-params";
import { Toolbar } from "./toolbar";
import { UserActions } from "./user-actions";

type DataTableProps = {
	data: { user: User; sessions: UserSession[] }[];
	totalCountInDb?: number;
};

type PaginationData = {
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

const calculatePagination = (offset: number, limit: number, total: number): PaginationData => {
	const currentPage = Math.floor(offset / limit) + 1;
	const totalPages = Math.ceil(total / limit);
	const from = Math.min(offset + 1, total);
	const to = Math.min(offset + limit, total);
	const hasNextPage = currentPage < totalPages;
	const hasPreviousPage = currentPage > 1;
	const previousOffset = Math.max(0, offset - limit);
	const nextOffset = offset + limit;

	const pageNumbers = generatePageNumbers(currentPage, totalPages);

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

const generatePageNumbers = (currentPage: number, totalPages: number): (number | "ellipsis")[] => {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	const pages: (number | "ellipsis")[] = [1];

	if (currentPage <= 3) {
		pages.push(2, 3, 4, "ellipsis", totalPages);
	} else if (currentPage >= totalPages - 2) {
		pages.push("ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
	} else {
		pages.push("ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages);
	}

	return pages;
};

type PaginationControlsProps = {
	paginationData: PaginationData;
	serializeUrl: (upsert: QueryType) => string;
};

const PaginationControls = ({ paginationData, serializeUrl }: PaginationControlsProps) => {
	const t = useTranslations("UserManagement.dataTable");
	const { currentPage, hasNextPage, hasPreviousPage, nextOffset, pageNumbers, previousOffset, totalPages } = paginationData;

	if (totalPages <= 1) {
		return null;
	}

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem className={hasPreviousPage ? "" : "pointer-events-none opacity-50"}>
					<PaginationPrevious aria-label={t("pagination.previous")} href={hasPreviousPage ? serializeUrl({ offset: previousOffset }) : "#"} />
				</PaginationItem>

				{pageNumbers.map((pageNum, idx) => {
					if (pageNum === "ellipsis") {
						// Use position-based key for ellipsis since they represent different ranges
						const ellipsisKey = idx < pageNumbers.length / 2 ? "ellipsis-start" : "ellipsis-end";
						return (
							<PaginationItem key={ellipsisKey}>
								<PaginationEllipsis />
							</PaginationItem>
						);
					}

					const isCurrentPage = pageNum === currentPage;
					const pageOffset = (pageNum - 1) * (paginationData.to - paginationData.from + 1);

					return (
						<PaginationItem key={pageNum}>
							<PaginationLink
								aria-current={isCurrentPage ? "page" : undefined}
								aria-label={t("pagination.page", { page: pageNum })}
								href={serializeUrl({ offset: pageOffset })}
								isActive={isCurrentPage}
							>
								{pageNum}
							</PaginationLink>
						</PaginationItem>
					);
				})}

				<PaginationItem className={hasNextPage ? "" : "pointer-events-none opacity-50"}>
					<PaginationNext aria-label={t("pagination.next")} href={hasNextPage ? serializeUrl({ offset: nextOffset }) : "#"} />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};

export function DataTable({ data, totalCountInDb }: DataTableProps) {
	const t = useTranslations("UserManagement.dataTable");
	const { query } = searchParamsCache.all();

	const { limit = 10, offset = 0 } = query;

	const serialize = createSerializer(querySearchParams);

	const serializeUrl = (upsert: QueryType) =>
		`/user-management${serialize({
			query: {
				...query,
				...upsert,
			},
		})}`;

	const paginationData = calculatePagination(offset, limit, totalCountInDb ?? 0);

	return (
		<Table className="rounded border">
			<TableHeader className="bg-muted p-32">
				<Toolbar />
				<TableRow className="text-md">
					<TableHead className="w-[100px]">{t("avatar")}</TableHead>
					<TableHead>
						<Button asChild size="icon-lg" variant="ghost">
							<Link href={serializeUrl({ sortBy: "name", sortDirection: query.sortDirection === "asc" ? "desc" : "asc" })}>
								{t("name")} {query.sortBy === "name" && (query.sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />)}
							</Link>
						</Button>
					</TableHead>
					<TableHead>
						<Button asChild size="icon-lg" variant="ghost">
							<Link href={serializeUrl({ sortBy: "email", sortDirection: query.sortDirection === "asc" ? "desc" : "asc" })}>
								{t("email")} {query.sortBy === "email" && (query.sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />)}
							</Link>
						</Button>
					</TableHead>
					<TableHead>{t("sessions")}</TableHead>
					<TableHead className="text-right">{t("actions")}</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody className="h-full">
				{data.length === 0 ? (
					<TableRow>
						<TableCell className="h-24 text-center" colSpan={5}>
							<div className="flex flex-col items-center justify-center gap-2 py-8">
								<p className="font-semibold text-lg">{t("empty.title")}</p>
								<p className="text-muted-foreground text-sm">{t("empty.description")}</p>
							</div>
						</TableCell>
					</TableRow>
				) : (
					data.map(({ user, sessions }) => (
						<TableRow key={user.id}>
							<TableCell>
								<Avatar className="relative size-10">
									<AvatarImage alt={user.name || t("unknownUser")} src={user.image || ""} />
									<AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
								</Avatar>
							</TableCell>
							<TableCell className="font-medium">{user.name || t("unknownUser")}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>{sessions.length}</TableCell>
							<TableCell className="text-right">
								<UserActions userId={user.id} />
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
								{totalCountInDb ? (
									t("pagination.showing", {
										from: paginationData.from,
										to: paginationData.to,
										total: totalCountInDb,
									})
								) : (
									<span>&nbsp;</span>
								)}
							</div>
							<PaginationControls paginationData={paginationData} serializeUrl={serializeUrl} />
						</div>
					</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	);
}
