import type { Client } from "@models";
import {
	GraphQLClient,
	type RequestDocument,
	type Variables,
} from "graphql-request";
import { AuthenticationError, GraphQLError, NetworkError } from "./errors";

export class StrapiGraphQLClient implements Client {
	private client: {
		request: <T = unknown>(
			document: RequestDocument,
			variables?: Variables,
		) => Promise<T>;
		raw: GraphQLClient;
	};

	constructor({ apiUrl, token }: { apiUrl: string; token: string | null }) {
		const graphqlEndpoint = `${apiUrl}/graphql`;

		const rawClient = new GraphQLClient(graphqlEndpoint, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		this.client = {
			request: async <T = unknown>(
				document: RequestDocument,
				variables?: Variables,
			): Promise<T> => {
				return handleRequest(() => rawClient.request<T>(document, variables));
			},
			raw: rawClient,
		};
	}

	async executeQuery<T = unknown>(
		query: string,
		variables?: Record<string, unknown>,
	): Promise<T> {
		return this.client.request<T>(query, variables);
	}
}

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
