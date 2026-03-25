import { StrapiContentProvider } from "../cms/strapi/strapi-content-provider";
import type { ContentPort } from "./ports";

/**
 * Factory for the active content backend. Swap the implementation here to change CMS.
 */
export function createContentProvider(): ContentPort {
	const baseUrl = import.meta.env.STRAPI_URL?.replace(/\/$/, "");
	if (!baseUrl) {
		throw new Error(
			"STRAPI_URL is not set. Copy .env.example to .env and point it at your Strapi instance.",
		);
	}

	const apiToken = import.meta.env.STRAPI_API_TOKEN;
	return new StrapiContentProvider({
		baseUrl,
		apiToken:
			typeof apiToken === "string" && apiToken.length > 0
				? apiToken
				: undefined,
	});
}
