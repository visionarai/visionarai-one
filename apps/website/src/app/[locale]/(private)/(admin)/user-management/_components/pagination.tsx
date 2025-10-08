"use client";

import { Button } from "@visionarai-one/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { Link } from "@/i18n/navigation";
import { querySearchParams, serializeUrl } from "../_state/search-params";

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

export function Pagination(paginationData: PaginationData) {
	const [{ query }] = useQueryStates(querySearchParams);
	const tData = useTranslations("UserManagement.dataTable");
	return (
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
	);
}
