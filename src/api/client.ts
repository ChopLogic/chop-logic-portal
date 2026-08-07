import { GraphQLClient } from "graphql-request";

const STRAPI_URL = import.meta.env.STRAPI_URL;
const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN;
const GRAPHQL_ENDPOINT = `${STRAPI_URL}/graphql`;

export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
	headers: {
		Authorization: `Bearer ${STRAPI_API_TOKEN}`,
	},
});

export async function executeQuery<T = unknown>(
	queryString: string,
	variables?: Record<string, unknown>,
): Promise<T> {
	return graphqlClient.request(queryString, variables);
}
