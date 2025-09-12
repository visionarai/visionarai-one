import { getHighlightedTokens } from "../utils/json-highlighting";

export type RawViewProps = {
	json: string;
	wrap: boolean;
};

export const RawView = ({ json, wrap }: RawViewProps) => {
	const highlightedJson = getHighlightedTokens(json);

	return <pre className={`leading-snug ${wrap ? "whitespace-pre-wrap break-all" : "whitespace-pre"}`}>{highlightedJson}</pre>;
};
