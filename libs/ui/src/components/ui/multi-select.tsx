"use client";

import {
	Badge,
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@visionarai-one/ui";
import { cn } from "@visionarai-one/utils";
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";

import { type ComponentPropsWithoutRef, createContext, type ReactNode, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";

type MultiSelectContextType = {
	open: boolean;
	setOpen: (open: boolean) => void;
	selectedValues: Set<string>;
	toggleValue: (value: string) => void;
	items: Map<string, ReactNode>;
	onItemAdded: (value: string, label: ReactNode) => void;
};
const MultiSelectContext = createContext<MultiSelectContextType | null>(null);

export function MultiSelect({
	children,
	values,
	defaultValues,
	onValuesChange,
}: {
	children: ReactNode;
	values?: string[];
	defaultValues?: string[];
	onValuesChange?: (values: string[]) => void;
}) {
	const [open, setOpen] = useState(false);
	const [selectedValues, setSelectedValues] = useState(new Set<string>(values ?? defaultValues));
	const [items, setItems] = useState<Map<string, ReactNode>>(new Map());

	function toggleValue(value: string) {
		setSelectedValues((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(value)) {
				newSet.delete(value);
			} else {
				newSet.add(value);
			}

			onValuesChange?.([...newSet]);
			return newSet;
		});
	}

	const onItemAdded = useCallback((value: string, label: ReactNode) => {
		setItems((prev) => {
			if (prev.get(value) === label) return prev;
			return new Map(prev).set(value, label);
		});
	}, []);

	return (
		<MultiSelectContext
			value={{
				items,
				onItemAdded,
				open,
				selectedValues: values ? new Set(values) : selectedValues,
				setOpen,
				toggleValue,
			}}
		>
			<Popover onOpenChange={setOpen} open={open}>
				{children}
			</Popover>
		</MultiSelectContext>
	);
}

export function MultiSelectTrigger({
	className,
	children,
	...props
}: {
	className?: string;
	children?: ReactNode;
} & ComponentPropsWithoutRef<typeof Button>) {
	const { open } = useMultiSelectContext();

	return (
		<PopoverTrigger asChild>
			<Button
				{...props}
				aria-expanded={props["aria-expanded"] ?? open}
				className={cn(
					"flex h-auto min-h-9 w-fit items-center justify-between gap-2 overflow-hidden whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[placeholder]:text-muted-foreground dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:hover:bg-input/50 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
					className
				)}
				role={props.role ?? "combobox"}
				variant={props.variant ?? "outline"}
			>
				{children}
				<ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
			</Button>
		</PopoverTrigger>
	);
}

export function MultiSelectValue({
	placeholder,
	clickToRemove = true,
	className,
	overflowBehavior = "wrap-when-open",
	overflowContent = (overflowAmount: number) => `+${overflowAmount}`,
	...props
}: {
	placeholder?: string;
	clickToRemove?: boolean;
	overflowBehavior?: "wrap" | "wrap-when-open" | "cutoff";
	overflowContent?: (overflowAmount: number) => ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "children">) {
	const { selectedValues, toggleValue, items, open } = useMultiSelectContext();
	const [overflowAmount, setOverflowAmount] = useState(0);
	const valueRef = useRef<HTMLDivElement>(null);
	const overflowRef = useRef<HTMLDivElement>(null);
	const itemsRef = useRef<Set<HTMLElement>>(new Set());

	const shouldWrap = overflowBehavior === "wrap" || (overflowBehavior === "wrap-when-open" && open);

	const checkOverflow = useCallback(() => {
		if (valueRef.current == null) return;

		const containerElement = valueRef.current;
		const overflowElement = overflowRef.current;

		if (overflowElement != null) overflowElement.style.display = "none";
		itemsRef.current.forEach((child) => child.style.removeProperty("display"));
		let amount = 0;
		for (let i = itemsRef.current.size - 1; i >= 0; i--) {
			const child = [...itemsRef.current][i];
			if (containerElement.scrollWidth <= containerElement.clientWidth) {
				break;
			}
			amount = itemsRef.current.size - i;
			child.style.display = "none";
			overflowElement?.style.removeProperty("display");
		}
		setOverflowAmount(amount);
	}, []);

	useEffect(() => {
		if (valueRef.current == null) return;

		const observer = new ResizeObserver(checkOverflow);
		observer.observe(valueRef.current);

		return () => observer.disconnect();
	}, [checkOverflow]);

	useLayoutEffect(() => {
		checkOverflow();
	}, [selectedValues, open, checkOverflow]);

	if (selectedValues.size === 0 && placeholder) {
		return <span className="font-normal text-muted-foreground">{placeholder}</span>;
	}

	return (
		<div {...props} className={cn("flex w-full gap-1.5 overflow-hidden", shouldWrap && "h-full flex-wrap", className)} ref={valueRef}>
			{[...selectedValues]
				.filter((value) => items.has(value))
				.map((value) => (
					<Badge
						className="group flex items-center gap-1"
						key={value}
						onClick={
							clickToRemove
								? (e) => {
										e.stopPropagation();
										toggleValue(value);
									}
								: undefined
						}
						ref={(el) => {
							if (el == null) return;

							itemsRef.current.add(el);
							return () => {
								itemsRef.current.delete(el);
							};
						}}
						variant="outline"
					>
						{items.get(value)}
						{clickToRemove && <XIcon className="size-2 text-muted-foreground group-hover:text-destructive" />}
					</Badge>
				))}
			<Badge
				ref={overflowRef}
				style={{
					display: overflowAmount > 0 && !shouldWrap ? "block" : "none",
				}}
				variant="outline"
			>
				{overflowContent(overflowAmount)}
			</Badge>
		</div>
	);
}

export function MultiSelectContent({
	search = true,
	children,
	...props
}: {
	search?: boolean | { placeholder?: string; emptyMessage?: string };
	children: ReactNode;
} & Omit<ComponentPropsWithoutRef<typeof Command>, "children">) {
	const canSearch = typeof search === "object" ? true : search;

	return (
		<>
			<div style={{ display: "none" }}>
				<Command>
					<CommandList>{children}</CommandList>
				</Command>
			</div>
			<PopoverContent className="min-w-[var(--radix-popover-trigger-width)] p-0">
				<Command {...props}>
					{canSearch ? (
						<CommandInput placeholder={typeof search === "object" ? search.placeholder : undefined} />
					) : (
						<button aria-hidden="true" autoFocus className="sr-only" />
					)}
					<CommandList>
						{canSearch && <CommandEmpty>{typeof search === "object" ? search.emptyMessage : undefined}</CommandEmpty>}
						{children}
					</CommandList>
				</Command>
			</PopoverContent>
		</>
	);
}

export function MultiSelectItem({
	value,
	children,
	badgeLabel,
	onSelect,
	...props
}: {
	badgeLabel?: ReactNode;
	value: string;
} & Omit<ComponentPropsWithoutRef<typeof CommandItem>, "value">) {
	const { toggleValue, selectedValues, onItemAdded } = useMultiSelectContext();
	const isSelected = selectedValues.has(value);

	useEffect(() => {
		onItemAdded(value, badgeLabel ?? children);
	}, [value, children, onItemAdded, badgeLabel]);

	return (
		<CommandItem
			{...props}
			onSelect={(v) => {
				toggleValue(v);
				onSelect?.(v);
			}}
			value={value}
		>
			<CheckIcon className={cn("mr-2 size-4", isSelected ? "opacity-100" : "opacity-0")} />
			{children}
		</CommandItem>
	);
}

export function MultiSelectGroup(props: ComponentPropsWithoutRef<typeof CommandGroup>) {
	return <CommandGroup {...props} />;
}

export function MultiSelectSeparator(props: ComponentPropsWithoutRef<typeof CommandSeparator>) {
	return <CommandSeparator {...props} />;
}

function useMultiSelectContext() {
	const context = useContext(MultiSelectContext);
	if (context == null) {
		throw new Error("useMultiSelectContext must be used within a MultiSelectContext");
	}
	return context;
}
