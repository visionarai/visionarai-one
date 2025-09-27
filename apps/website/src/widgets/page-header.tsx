type PageHeaderProps = {
	title: string;
	subtitle: string;
	children?: React.ReactNode;
};

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
	return (
		<header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
				<p className="text-md text-muted-foreground">{subtitle}</p>
			</div>
			<div className="flex items-center gap-2">{children}</div>
		</header>
	);
}
