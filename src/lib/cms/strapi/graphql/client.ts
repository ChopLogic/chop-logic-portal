import { type RequestDocument, request } from "graphql-request";
import type { StrapiClientConfig } from "../client";

export type StrapiGraphqlClientConfig = StrapiClientConfig;

export function strapiGraphqlEndpoint(baseUrl: string): string {
	const root = baseUrl.replace(/\/$/, "");
	return new URL("graphql", `${root}/`).toString();
}

export async function strapiGraphqlRequest<T>(
	config: StrapiGraphqlClientConfig,
	document: RequestDocument,
	variables?: Record<string, unknown>,
): Promise<T> {
	const headers: Record<string, string> = {};
	if (config.apiToken) {
		headers["Authorization"] = `Bearer ${config.apiToken}`;
	}
	return request<T>(
		strapiGraphqlEndpoint(config.baseUrl),
		document,
		variables,
		headers,
	);
}
