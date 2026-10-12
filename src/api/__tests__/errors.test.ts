import { describe, expect, it } from "vitest";
import {
	ApiError,
	AuthenticationError,
	GraphQLError,
	NetworkError,
} from "../errors";

describe("ApiError", () => {
	describe("constructor", () => {
		it("sets message correctly", () => {
			const error = new ApiError("Something went wrong");

			expect(error.message).toBe("Something went wrong");
		});

		it("sets name to ApiError", () => {
			const error = new ApiError("Something went wrong");

			expect(error.name).toBe("ApiError");
		});

		it("sets statusCode when provided", () => {
			const error = new ApiError("Bad request", 400);

			expect(error.statusCode).toBe(400);
		});

		it("sets code when provided", () => {
			const error = new ApiError("Bad request", 400, "BAD_REQUEST");

			expect(error.code).toBe("BAD_REQUEST");
		});

		it("sets details when provided", () => {
			const details = { field: "email", reason: "invalid" };
			const error = new ApiError("Bad request", 400, "BAD_REQUEST", details);

			expect(error.details).toEqual(details);
		});

		it("leaves optional fields undefined when not provided", () => {
			const error = new ApiError("Minimal error");

			expect(error.statusCode).toBeUndefined();
			expect(error.code).toBeUndefined();
			expect(error.details).toBeUndefined();
		});
	});

	describe("inheritance", () => {
		it("is an instance of Error", () => {
			expect(new ApiError("x")).toBeInstanceOf(Error);
		});

		it("is an instance of ApiError", () => {
			expect(new ApiError("x")).toBeInstanceOf(ApiError);
		});

		it("has a stack trace", () => {
			const error = new ApiError("x");

			expect(error.stack).toBeDefined();
		});
	});
});

describe("NetworkError", () => {
	describe("constructor", () => {
		it("sets message correctly", () => {
			const error = new NetworkError("Network is down");

			expect(error.message).toBe("Network is down");
		});

		it("sets name to NetworkError", () => {
			const error = new NetworkError("Network is down");

			expect(error.name).toBe("NetworkError");
		});

		it("captures the original error when provided", () => {
			const original = new TypeError("failed to fetch");
			const error = new NetworkError("Network is down", original);

			expect(error.originalError).toBe(original);
		});

		it("leaves originalError undefined when not provided", () => {
			const error = new NetworkError("Network is down");

			expect(error.originalError).toBeUndefined();
		});
	});

	describe("inheritance", () => {
		it("is an instance of Error", () => {
			expect(new NetworkError("x")).toBeInstanceOf(Error);
		});

		it("is an instance of ApiError", () => {
			expect(new NetworkError("x")).toBeInstanceOf(ApiError);
		});

		it("is an instance of NetworkError", () => {
			expect(new NetworkError("x")).toBeInstanceOf(NetworkError);
		});
	});
});

describe("GraphQLError", () => {
	const sampleErrors = [
		{ message: "Field not found", path: ["article", "slug"] },
		{ message: "Unauthorized", extensions: { code: "FORBIDDEN" } },
	];

	describe("constructor", () => {
		it("sets message correctly", () => {
			const error = new GraphQLError("GraphQL query failed", sampleErrors);

			expect(error.message).toBe("GraphQL query failed");
		});

		it("sets name to GraphQLError", () => {
			const error = new GraphQLError("GraphQL query failed", sampleErrors);

			expect(error.name).toBe("GraphQLError");
		});

		it("preserves the GraphQL errors array", () => {
			const error = new GraphQLError("GraphQL query failed", sampleErrors);

			expect(error.errors).toEqual(sampleErrors);
			expect(error.errors).toHaveLength(2);
		});

		it("accepts an empty errors array", () => {
			const error = new GraphQLError("GraphQL query failed", []);

			expect(error.errors).toEqual([]);
		});
	});

	describe("inheritance", () => {
		it("is an instance of Error", () => {
			expect(new GraphQLError("x", [])).toBeInstanceOf(Error);
		});

		it("is an instance of ApiError", () => {
			expect(new GraphQLError("x", [])).toBeInstanceOf(ApiError);
		});

		it("is an instance of GraphQLError", () => {
			expect(new GraphQLError("x", [])).toBeInstanceOf(GraphQLError);
		});
	});
});

describe("AuthenticationError", () => {
	describe("constructor", () => {
		it("uses the default message when none is provided", () => {
			const error = new AuthenticationError();

			expect(error.message).toBe("Authentication failed");
		});

		it("uses a custom message when provided", () => {
			const error = new AuthenticationError("Token expired");

			expect(error.message).toBe("Token expired");
		});

		it("sets statusCode to 401", () => {
			const error = new AuthenticationError();

			expect(error.statusCode).toBe(401);
		});

		it("sets name to AuthenticationError", () => {
			const error = new AuthenticationError();

			expect(error.name).toBe("AuthenticationError");
		});
	});

	describe("inheritance", () => {
		it("is an instance of Error", () => {
			expect(new AuthenticationError()).toBeInstanceOf(Error);
		});

		it("is an instance of ApiError", () => {
			expect(new AuthenticationError()).toBeInstanceOf(ApiError);
		});

		it("is an instance of AuthenticationError", () => {
			expect(new AuthenticationError()).toBeInstanceOf(AuthenticationError);
		});
	});
});
