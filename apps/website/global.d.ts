import type { formats } from "@/i18n/request";
import type { routing } from "@/i18n/routing";
import messages from "../../messages/en.json" with { type: "json" };

declare module "next-intl" {
	type AppConfig = {
		Locale: (typeof routing.locales)[number];
		Messages: typeof messages;
		Formats: typeof formats;
	};
}
