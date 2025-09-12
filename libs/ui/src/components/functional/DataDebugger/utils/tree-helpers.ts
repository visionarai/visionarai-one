export type NodeProps = { value: unknown; name?: string | number; depth?: number };

export const INDENT = 12;

export const isExpandable = (v: unknown) => v !== null && typeof v === "object" && (Array.isArray(v) ? v.length > 0 : Object.keys(v as object).length > 0);

export const previewValue = (v: unknown): string => {
	if (v === null) {
		return "null";
	}
	if (typeof v === "string") {
		return v.length > 32 ? JSON.stringify(`${v.slice(0, 32)}…`) : JSON.stringify(v);
	}
	if (typeof v === "number" || typeof v === "boolean") {
		return String(v);
	}
	if (Array.isArray(v)) {
		return `Array(${v.length})`;
	}
	if (typeof v === "object") {
		return `Object(${Object.keys(v as object).length})`;
	}
	return typeof v;
};
