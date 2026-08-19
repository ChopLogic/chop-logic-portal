import type { Config } from "@models";

export class ConfigService implements Config {
	private config: Record<string, string | undefined>;

	constructor() {
		this.config = {
			STRAPI_URL: import.meta.env.STRAPI_URL,
			STRAPI_API_TOKEN: import.meta.env.STRAPI_API_TOKEN,
			PUBLIC_SITE_URL: import.meta.env.PUBLIC_SITE_URL,
		};
	}

	get(key: string): string | undefined {
		return this.config[key];
	}

	getApiUrl(): string {
		return this.get("STRAPI_URL") || "http://localhost:1337";
	}

	getApiToken(): string | null {
		return this.get("STRAPI_API_TOKEN") || null;
	}

	getSiteUrl(): string {
		return this.get("PUBLIC_SITE_URL") || "http://localhost:4321";
	}

	isProduction(): boolean {
		return import.meta.env.PROD;
	}

	isDevelopment(): boolean {
		return import.meta.env.DEV;
	}
}
