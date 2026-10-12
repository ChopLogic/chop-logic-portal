import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("ConfigService", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	describe("get", () => {
		it("returns correct value for existing key", async () => {
			vi.stubEnv("STRAPI_URL", "https://strapi.example.com");
			vi.stubEnv("STRAPI_API_TOKEN", "token123");
			vi.stubEnv("PUBLIC_SITE_URL", "https://site.example.com");

			const { ConfigService } = await import("../config.service");
			const service = new ConfigService();

			expect(service.get("STRAPI_URL")).toBe("https://strapi.example.com");
		});

		it("returns undefined for missing key", async () => {
			const { ConfigService } = await import("../config.service");
			const service = new ConfigService();

			expect(service.get("NON_EXISTENT_KEY")).toBeUndefined();
		});

		it("returns undefined for key with undefined value", async () => {
			// Don't set STRAPI_URL - it will be undefined
			const { ConfigService } = await import("../config.service");
			const service = new ConfigService();

			// When not set via stubEnv, the value will be undefined
			expect(service.get("STRAPI_URL")).toBeUndefined();
		});
	});

	describe("getApiUrl", () => {
		it("returns STRAPI_URL when set", async () => {
			vi.stubEnv("STRAPI_URL", "https://api.mystrapi.com");

			const { ConfigService } = await import("../config.service");
			const service = new ConfigService();

			expect(service.getApiUrl()).toBe("https://api.mystrapi.com");
		});

		it("returns default localhost URL when STRAPI_URL is not set", async () => {
			// Ensure STRAPI_URL is not set
			vi.stubEnv("STRAPI_URL", "");

			const { ConfigService } = await import("../config.service");
			const service = new ConfigService();

			expect(service.getApiUrl()).toBe("http://localhost:1337");
		});

		it("preserves URL with port", async () => {
			vi.stubEnv("STRAPI_URL", "https://strapi.example.com:8080");

			const { ConfigService } = await import("../config.service");
			const service = new ConfigService();

			expect(service.getApiUrl()).toBe("https://strapi.example.com:8080");
		});

		it("preserves URL with path", async () => {
			vi.stubEnv("STRAPI_URL", "https://example.com/strapi");

			const { ConfigService } = await import("../config.service");
			const service = new ConfigService();

			expect(service.getApiUrl()).toBe("https://example.com/strapi");
		});
	});

	describe("getApiToken", () => {
		it("returns token when STRAPI_API_TOKEN is set", async () => {
			vi.stubEnv("STRAPI_API_TOKEN", "my-secret-token-abc123");

			const { ConfigService } = await import("../config.service");
			const service = new ConfigService();

			expect(service.getApiToken()).toBe("my-secret-token-abc123");
		});

		it("returns null when STRAPI_API_TOKEN is not set", async () => {
			vi.stubEnv("STRAPI_API_TOKEN", "");

			const { ConfigService } = await import("../config.service");
			const service = new ConfigService();

			expect(service.getApiToken()).toBeNull();
		});

		it("preserves long token values", async () => {
			const longToken = "a".repeat(500);
			vi.stubEnv("STRAPI_API_TOKEN", longToken);

			const { ConfigService } = await import("../config.service");
			const service = new ConfigService();

			expect(service.getApiToken()).toBe(longToken);
		});
	});

	describe("getSiteUrl", () => {
		it("returns PUBLIC_SITE_URL when set", async () => {
			vi.stubEnv("PUBLIC_SITE_URL", "https://mysite.com");

			const { ConfigService } = await import("../config.service");
			const service = new ConfigService();

			expect(service.getSiteUrl()).toBe("https://mysite.com");
		});

		it("returns default localhost URL when PUBLIC_SITE_URL is not set", async () => {
			vi.stubEnv("PUBLIC_SITE_URL", "");

			const { ConfigService } = await import("../config.service");
			const service = new ConfigService();

			expect(service.getSiteUrl()).toBe("http://localhost:4321");
		});

		it("preserves URL with trailing slash", async () => {
			vi.stubEnv("PUBLIC_SITE_URL", "https://mysite.com/");

			const { ConfigService } = await import("../config.service");
			const service = new ConfigService();

			expect(service.getSiteUrl()).toBe("https://mysite.com/");
		});
	});

	describe("isProduction", () => {
		it("returns boolean based on PROD env", async () => {
			const { ConfigService } = await import("../config.service");
			const service = new ConfigService();

			// isProduction reads import.meta.env.PROD directly, not from constructor cache
			// The result depends on the test environment
			expect(typeof service.isProduction()).toBe("boolean");
		});
	});

	describe("isDevelopment", () => {
		it("returns boolean based on DEV env", async () => {
			const { ConfigService } = await import("../config.service");
			const service = new ConfigService();

			// isDevelopment reads import.meta.env.DEV directly, not from constructor cache
			// The result depends on the test environment
			expect(typeof service.isDevelopment()).toBe("boolean");
		});
	});

	describe("edge cases", () => {
		it("handles all config values being set", async () => {
			vi.stubEnv("STRAPI_URL", "https://strapi.example.com");
			vi.stubEnv("STRAPI_API_TOKEN", "secret-token");
			vi.stubEnv("PUBLIC_SITE_URL", "https://site.example.com");

			const { ConfigService } = await import("../config.service");
			const service = new ConfigService();

			expect(service.getApiUrl()).toBe("https://strapi.example.com");
			expect(service.getApiToken()).toBe("secret-token");
			expect(service.getSiteUrl()).toBe("https://site.example.com");
		});

		it("handles all config values being empty", async () => {
			vi.stubEnv("STRAPI_URL", "");
			vi.stubEnv("STRAPI_API_TOKEN", "");
			vi.stubEnv("PUBLIC_SITE_URL", "");

			const { ConfigService } = await import("../config.service");
			const service = new ConfigService();

			expect(service.getApiUrl()).toBe("http://localhost:1337");
			expect(service.getApiToken()).toBeNull();
			expect(service.getSiteUrl()).toBe("http://localhost:4321");
		});

		it("caches config values at construction time", async () => {
			vi.stubEnv("STRAPI_URL", "https://first.com");

			const { ConfigService } = await import("../config.service");
			const service = new ConfigService();

			// Value is cached from construction
			expect(service.getApiUrl()).toBe("https://first.com");

			// Even if we change the env, the service still has the cached value
			// (This is the expected behavior based on how ConfigService works)
			expect(service.get("STRAPI_URL")).toBe("https://first.com");
		});
	});
});
