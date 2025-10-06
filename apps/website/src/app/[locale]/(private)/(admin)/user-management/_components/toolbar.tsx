"use client";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
	TableCell,
	TableRow,
	useDebounceFunction,
} from "@visionarai-one/ui";
import { useQueryStates } from "nuqs";
import { querySearchParams } from "../_state/search-params";

export function Toolbar() {
	const [{ query, selectSearchField }, setParams] = useQueryStates(querySearchParams);
	const [debounceSetParams] = useDebounceFunction(setParams, 500);
	return (
		<TableRow>
			<TableCell colSpan={5}>
				<div className="flex w-full items-center justify-between gap-4">
					<InputGroup>
						<InputGroupInput
							onChange={(e) => {
								e.preventDefault();
								const searchValue = e.target.value;
								debounceSetParams({
									query: {
										...query,
										searchValue,
									},
								});
							}}
							placeholder="Enter search query"
						/>
						<InputGroupAddon align="inline-end">
							<Select onValueChange={(value: string) => setParams({ selectSearchField: value as "email" | "name" })} value={selectSearchField}>
								<SelectTrigger className="border-0" size="sm">
									<SelectValue placeholder="Select search field" />
								</SelectTrigger>

								<SelectContent>
									<SelectGroup>
										<SelectItem value="email">Email</SelectItem>
										<SelectItem value="name">Name</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</InputGroupAddon>
					</InputGroup>
				</div>
			</TableCell>
		</TableRow>
	);
}
