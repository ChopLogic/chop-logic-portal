import { StrapiGraphqlContentProvider } from "../cms/strapi/strapi-graphql-content-provider";
import type { ContentPort } from "./ports";

export function createContentProvider(): ContentPort {
	const baseUrl = import.meta.env.STRAPI_URL?.replace(/\/$/, "");
	if (!baseUrl) {
		throw new Error(
			"STRAPI_URL is not set. Copy .env.example to .env and point it at your Strapi instance.",
		);
	}

	const apiToken = import.meta.env.STRAPI_API_TOKEN;
	const config = {
		baseUrl,
		apiToken:
			typeof apiToken === "string" && apiToken.length > 0
				? apiToken
				: undefined,
	};

	return new StrapiGraphqlContentProvider(config);
}
