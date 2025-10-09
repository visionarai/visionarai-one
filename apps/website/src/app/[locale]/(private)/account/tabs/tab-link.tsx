"use client";

import { Button, type TabsTrigger } from "@visionarai-one/ui";
import { useQueryStates } from "nuqs";
import { type AccountTab, getTabDetails, querySearchParams } from "../_state/search-params";

type TabLinkProps = React.ComponentProps<typeof TabsTrigger> & {
	value: AccountTab;
};

export function TabLink({ value, className }: TabLinkProps) {
	const [_, setSearchParams] = useQueryStates(querySearchParams);
	const tabDetails = getTabDetails(value);
	return (
		<Button className={`flex-1 justify-center ${className}`} onClick={() => setSearchParams({ selectedTab: value })} variant="ghost">
			{tabDetails.icon}
			{tabDetails.title}
		</Button>
	);
}
