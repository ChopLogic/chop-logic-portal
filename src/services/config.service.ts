import type { Config } from "@models";

export class ConfigService implements Config {
	private config: Record<string, string | undefined>;

	constructor() {
		this.config = {
			STRAPI_URL: import.meta.env.STRAPI_URL,
			STRAPI_API_TOKEN: import.meta.env.STRAPI_API_TOKEN,
			NODE_ENV: import.meta.env.NODE_ENV,
			BASE_URL: import.meta.env.BASE_URL,
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
		return this.get("BASE_URL") || "http://localhost:4321";
	}

	isProduction(): boolean {
		return this.get("NODE_ENV") === "production";
	}
}
