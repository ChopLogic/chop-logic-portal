import {
	GraphQLClient,
	type RequestDocument,
	type Variables,
} from "graphql-request";
import { AuthenticationError, GraphQLError, NetworkError } from "./errors";

const STRAPI_URL = import.meta.env.STRAPI_URL;
const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN;
const GRAPHQL_ENDPOINT = `${STRAPI_URL}/graphql`;

const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
	headers: {
		Authorization: `Bearer ${STRAPI_API_TOKEN}`,
	},
});

async function handleRequest<T>(requestFn: () => Promise<T>): Promise<T> {
	try {
		return await requestFn();
	} catch (error) {
		if (error instanceof TypeError && error.message.includes("fetch")) {
			throw new NetworkError(
				"Network error - please check your internet connection",
				error,
			);
		}

		if (error && typeof error === "object" && "response" in error) {
			const graphqlError = error as {
				response: {
					errors?: Array<{
						message: string;
						path?: string[];
						extensions?: unknown;
					}>;
					status?: number;
				};
			};

			if (graphqlError.response.status === 401) {
				throw new AuthenticationError();
			}

			if (
				graphqlError.response.errors &&
				graphqlError.response.errors.length > 0
			) {
				throw new GraphQLError(
					"GraphQL query failed",
					graphqlError.response.errors,
				);
			}
		}

		// Re-throw unknown errors
		throw error;
	}
}

export const graphqlClient = {
	request: async <T = unknown>(
		document: RequestDocument,
		variables?: Variables,
	): Promise<T> => {
		return handleRequest(() => client.request<T>(document, variables));
	},
	raw: client,
};

export async function executeQuery<T = unknown>(
	query: string,
	variables?: Record<string, unknown>,
): Promise<T> {
	return graphqlClient.request<T>(query, variables);
}
