import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
	// Typically corresponds to the `[locale]` segment
	const requested = await requestLocale;
	const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

	return {
		formats: {
			dateTime: {
				short: {
					day: "2-digit",
					localeMatcher: "best fit",
					month: "long",
					weekday: "short",
					year: "numeric",
				},
			},
			list: {
				enumeration: {
					style: "long",
					type: "conjunction",
				},
			},
			number: {
				precise: {
					maximumFractionDigits: 5,
				},
			},
		},
		locale,
		messages: (await import(`../../../../messages/${locale}.json`)).default,
	};
});
