import type { ReactNode } from "react";

// Highlighting regex (top-level for perf)
// Tokenization: keys, strings, literals, numbers
export const TOKEN_REGEX =
	/("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"\s*:)|("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;

export const KEY_RE = /^".*"\s*:$/u;
export const BOOL_RE = /^(true|false)$/u;
export const NULL_RE = /^null$/u;
export const NUM_RE = /^-?\d/;

const getTokenClass = (token: string): string => {
	if (KEY_RE.test(token)) {
		return "text-blue-400"; // key
	}
	if (token.startsWith('"')) {
		return "text-green-400"; // string
	}
	if (BOOL_RE.test(token)) {
		return "text-purple-400"; // bool
	}
	if (NULL_RE.test(token)) {
		return "text-gray-400 italic"; // null
	}
	if (NUM_RE.test(token)) {
		return "text-orange-400"; // number
	}
	return "text-foreground";
};

const createTokenElement = (token: string, start: number): ReactNode => {
	const cls = getTokenClass(token);
	return (
		<span className={cls} key={start}>
			{token}
		</span>
	);
};

export const getHighlightedTokens = (json: string): ReactNode[] => {
	if (json.length < 160) {
		return [json];
	}

	const out: ReactNode[] = [];
	let last = 0;

	for (const m of json.matchAll(TOKEN_REGEX)) {
		const start = m.index ?? 0;
		if (start > last) {
			out.push(json.slice(last, start));
		}

		const tok = m[0];
		out.push(createTokenElement(tok, start));
		last = start + tok.length;

		if (out.length > 3000) {
			break;
		}
	}

	if (last < json.length) {
		out.push(json.slice(last));
	}
	return out;
};

export const safeStringify = (obj: unknown, space = 2): string => {
	const seen = new WeakSet();
	return JSON.stringify(
		obj,
		(_key, value) => {
			if (typeof value === "object" && value !== null) {
				if (seen.has(value)) {
					return "[Circular]";
				}
				seen.add(value);
			}
			return value;
		},
		space
	);
};
