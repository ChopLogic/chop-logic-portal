import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { StrapiGraphQLClient } from "../client";
import { AuthenticationError, GraphQLError, NetworkError } from "../errors";

// Capture constructor args and the mocked request fn from graphql-request.
const mockRequest = vi.fn();
const graphQLClientConstructor = vi.fn();

vi.mock("graphql-request", () => ({
	GraphQLClient: class {
		request: Mock;
		constructor(endpoint: string, options: unknown) {
			graphQLClientConstructor(endpoint, options);
			this.request = mockRequest;
		}
	},
}));

const API_URL = "https://strapi.example.com";

describe("StrapiGraphQLClient", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("construction", () => {
		it("targets the /graphql endpoint derived from apiUrl", () => {
			new StrapiGraphQLClient({ apiUrl: API_URL, token: "token-123" });

			expect(graphQLClientConstructor).toHaveBeenCalledWith(
				"https://strapi.example.com/graphql",
				expect.anything(),
			);
		});

		it("sends the bearer token in the Authorization header", () => {
			new StrapiGraphQLClient({ apiUrl: API_URL, token: "token-123" });

			expect(graphQLClientConstructor).toHaveBeenCalledWith(
				expect.any(String),
				{ headers: { Authorization: "Bearer token-123" } },
			);
		});

		it("still builds an Authorization header when token is null", () => {
			new StrapiGraphQLClient({ apiUrl: API_URL, token: null });

			expect(graphQLClientConstructor).toHaveBeenCalledWith(
				expect.any(String),
				{ headers: { Authorization: "Bearer null" } },
			);
		});
	});

	describe("executeQuery", () => {
		it("resolves with the response returned by the underlying client", async () => {
			const response = { article: { title: "Hello" } };
			mockRequest.mockResolvedValueOnce(response);
			const client = new StrapiGraphQLClient({
				apiUrl: API_URL,
				token: "t",
			});

			await expect(client.executeQuery("query { article }")).resolves.toEqual(
				response,
			);
		});

		it("forwards the query document and variables to the client", async () => {
			mockRequest.mockResolvedValueOnce({});
			const client = new StrapiGraphQLClient({
				apiUrl: API_URL,
				token: "t",
			});

			await client.executeQuery("query ($slug: String) { article }", {
				slug: "my-article",
			});

			expect(mockRequest).toHaveBeenCalledWith(
				"query ($slug: String) { article }",
				{ slug: "my-article" },
			);
		});
	});

	describe("error handling", () => {
		it("maps a fetch-related TypeError to NetworkError", async () => {
			const original = new TypeError("Failed to fetch");
			mockRequest.mockRejectedValueOnce(original);
			const client = new StrapiGraphQLClient({
				apiUrl: API_URL,
				token: "t",
			});

			await expect(client.executeQuery("query {}")).rejects.toBeInstanceOf(
				NetworkError,
			);
		});

		it("preserves the original error inside the NetworkError", async () => {
			const original = new TypeError("Failed to fetch");
			mockRequest.mockRejectedValueOnce(original);
			const client = new StrapiGraphQLClient({
				apiUrl: API_URL,
				token: "t",
			});

			await expect(client.executeQuery("query {}")).rejects.toMatchObject({
				originalError: original,
			});
		});

		it("maps a 401 response to AuthenticationError", async () => {
			mockRequest.mockRejectedValueOnce({ response: { status: 401 } });
			const client = new StrapiGraphQLClient({
				apiUrl: API_URL,
				token: "t",
			});

			await expect(client.executeQuery("query {}")).rejects.toBeInstanceOf(
				AuthenticationError,
			);
		});

		it("maps a response with GraphQL errors to GraphQLError", async () => {
			const gqlErrors = [{ message: "Field missing", path: ["article"] }];
			mockRequest.mockRejectedValueOnce({
				response: { errors: gqlErrors },
			});
			const client = new StrapiGraphQLClient({
				apiUrl: API_URL,
				token: "t",
			});

			await expect(client.executeQuery("query {}")).rejects.toBeInstanceOf(
				GraphQLError,
			);
		});

		it("carries the GraphQL errors array into the GraphQLError", async () => {
			const gqlErrors = [{ message: "Field missing", path: ["article"] }];
			mockRequest.mockRejectedValueOnce({
				response: { errors: gqlErrors },
			});
			const client = new StrapiGraphQLClient({
				apiUrl: API_URL,
				token: "t",
			});

			await expect(client.executeQuery("query {}")).rejects.toMatchObject({
				errors: gqlErrors,
			});
		});

		it("re-throws an unknown error unchanged", async () => {
			const unknown = new Error("boom");
			mockRequest.mockRejectedValueOnce(unknown);
			const client = new StrapiGraphQLClient({
				apiUrl: API_URL,
				token: "t",
			});

			await expect(client.executeQuery("query {}")).rejects.toBe(unknown);
		});

		it("re-throws a response error that has neither 401 nor errors", async () => {
			const err = { response: { status: 500 } };
			mockRequest.mockRejectedValueOnce(err);
			const client = new StrapiGraphQLClient({
				apiUrl: API_URL,
				token: "t",
			});

			await expect(client.executeQuery("query {}")).rejects.toBe(err);
		});
	});
});
