import { type routing } from "@/features/i18n/routing";
import type messages from "@/locales/ru.json";

declare module "client-only" {}

declare module "server-only" {}

declare module "next-intl" {
	interface AppConfig {
		Locale: (typeof routing.locales)[number];
		Messages: typeof messages;
	}
}

// eslint-disable-next-line unicorn/require-module-specifiers
export {};
