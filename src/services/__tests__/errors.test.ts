import { describe, expect, it } from "vitest";
import {
	DataTransformationError,
	NotFoundError,
	ServiceError,
	ValidationError,
} from "../errors";

describe("ServiceError", () => {
	describe("constructor", () => {
		it("sets message correctly", () => {
			const error = new ServiceError("Test error message", "TEST_CODE");

			expect(error.message).toBe("Test error message");
		});

		it("sets code correctly", () => {
			const error = new ServiceError("Test error", "CUSTOM_CODE");

			expect(error.code).toBe("CUSTOM_CODE");
		});

		it("sets statusCode when provided", () => {
			const error = new ServiceError("Test error", "TEST_CODE", 500);

			expect(error.statusCode).toBe(500);
		});

		it("sets statusCode to undefined when not provided", () => {
			const error = new ServiceError("Test error", "TEST_CODE");

			expect(error.statusCode).toBeUndefined();
		});

		it("sets details when provided", () => {
			const details = { field: "value", nested: { data: 123 } };
			const error = new ServiceError("Test error", "TEST_CODE", 400, details);

			expect(error.details).toEqual(details);
		});

		it("sets details to undefined when not provided", () => {
			const error = new ServiceError("Test error", "TEST_CODE");

			expect(error.details).toBeUndefined();
		});

		it("sets name to ServiceError", () => {
			const error = new ServiceError("Test error", "TEST_CODE");

			expect(error.name).toBe("ServiceError");
		});
	});

	describe("inheritance", () => {
		it("is an instance of Error", () => {
			const error = new ServiceError("Test error", "TEST_CODE");

			expect(error).toBeInstanceOf(Error);
		});

		it("is an instance of ServiceError", () => {
			const error = new ServiceError("Test error", "TEST_CODE");

			expect(error).toBeInstanceOf(ServiceError);
		});

		it("has a stack trace", () => {
			const error = new ServiceError("Test error", "TEST_CODE");

			expect(error.stack).toBeDefined();
			expect(error.stack).toContain("ServiceError");
		});
	});
});

describe("NotFoundError", () => {
	describe("constructor", () => {
		it("generates correct message format with string identifier", () => {
			const error = new NotFoundError("Article", "test-slug");

			expect(error.message).toBe(
				'Article with identifier "test-slug" not found',
			);
		});

		it("generates correct message format with numeric identifier", () => {
			const error = new NotFoundError("User", 12345);

			expect(error.message).toBe('User with identifier "12345" not found');
		});

		it("sets code to NOT_FOUND", () => {
			const error = new NotFoundError("Resource", "id");

			expect(error.code).toBe("NOT_FOUND");
		});

		it("sets statusCode to 404", () => {
			const error = new NotFoundError("Resource", "id");

			expect(error.statusCode).toBe(404);
		});

		it("sets details with resource and identifier", () => {
			const error = new NotFoundError("Article", "my-article-slug");

			expect(error.details).toEqual({
				resource: "Article",
				identifier: "my-article-slug",
			});
		});

		it("sets name to NotFoundError", () => {
			const error = new NotFoundError("Resource", "id");

			expect(error.name).toBe("NotFoundError");
		});
	});

	describe("inheritance", () => {
		it("is an instance of Error", () => {
			const error = new NotFoundError("Resource", "id");

			expect(error).toBeInstanceOf(Error);
		});

		it("is an instance of ServiceError", () => {
			const error = new NotFoundError("Resource", "id");

			expect(error).toBeInstanceOf(ServiceError);
		});

		it("is an instance of NotFoundError", () => {
			const error = new NotFoundError("Resource", "id");

			expect(error).toBeInstanceOf(NotFoundError);
		});
	});

	describe("edge cases", () => {
		it("handles empty string identifier", () => {
			const error = new NotFoundError("Page", "");

			expect(error.message).toBe('Page with identifier "" not found');
			expect(error.details).toEqual({ resource: "Page", identifier: "" });
		});

		it("handles special characters in identifier", () => {
			const error = new NotFoundError("Article", "slug-with-special-chars_123");

			expect(error.message).toBe(
				'Article with identifier "slug-with-special-chars_123" not found',
			);
		});

		it("handles zero as numeric identifier", () => {
			const error = new NotFoundError("Item", 0);

			expect(error.message).toBe('Item with identifier "0" not found');
		});
	});
});

describe("ValidationError", () => {
	describe("constructor", () => {
		it("sets message correctly", () => {
			const error = new ValidationError("Invalid input provided");

			expect(error.message).toBe("Invalid input provided");
		});

		it("sets code to VALIDATION_ERROR", () => {
			const error = new ValidationError("Invalid input");

			expect(error.code).toBe("VALIDATION_ERROR");
		});

		it("sets statusCode to 400", () => {
			const error = new ValidationError("Invalid input");

			expect(error.statusCode).toBe(400);
		});

		it("sets details when provided", () => {
			const details = { field: "email", reason: "invalid format" };
			const error = new ValidationError("Invalid email", details);

			expect(error.details).toEqual(details);
		});

		it("sets details to undefined when not provided", () => {
			const error = new ValidationError("Invalid input");

			expect(error.details).toBeUndefined();
		});

		it("sets name to ValidationError", () => {
			const error = new ValidationError("Invalid input");

			expect(error.name).toBe("ValidationError");
		});
	});

	describe("inheritance", () => {
		it("is an instance of Error", () => {
			const error = new ValidationError("Invalid input");

			expect(error).toBeInstanceOf(Error);
		});

		it("is an instance of ServiceError", () => {
			const error = new ValidationError("Invalid input");

			expect(error).toBeInstanceOf(ServiceError);
		});

		it("is an instance of ValidationError", () => {
			const error = new ValidationError("Invalid input");

			expect(error).toBeInstanceOf(ValidationError);
		});
	});
});

describe("DataTransformationError", () => {
	describe("constructor", () => {
		it("sets message correctly", () => {
			const error = new DataTransformationError("Failed to transform data");

			expect(error.message).toBe("Failed to transform data");
		});

		it("sets code to TRANSFORMATION_ERROR", () => {
			const error = new DataTransformationError("Transform failed");

			expect(error.code).toBe("TRANSFORMATION_ERROR");
		});

		it("sets statusCode to 500", () => {
			const error = new DataTransformationError("Transform failed");

			expect(error.statusCode).toBe(500);
		});

		it("captures original error in details", () => {
			const originalError = new Error("Original error message");
			const error = new DataTransformationError(
				"Transform failed",
				originalError,
			);

			expect(error.details).toEqual({ originalError });
		});

		it("sets details with undefined originalError when not provided", () => {
			const error = new DataTransformationError("Transform failed");

			expect(error.details).toEqual({ originalError: undefined });
		});

		it("sets name to DataTransformationError", () => {
			const error = new DataTransformationError("Transform failed");

			expect(error.name).toBe("DataTransformationError");
		});
	});

	describe("inheritance", () => {
		it("is an instance of Error", () => {
			const error = new DataTransformationError("Transform failed");

			expect(error).toBeInstanceOf(Error);
		});

		it("is an instance of ServiceError", () => {
			const error = new DataTransformationError("Transform failed");

			expect(error).toBeInstanceOf(ServiceError);
		});

		it("is an instance of DataTransformationError", () => {
			const error = new DataTransformationError("Transform failed");

			expect(error).toBeInstanceOf(DataTransformationError);
		});
	});

	describe("original error handling", () => {
		it("captures Error instance as originalError", () => {
			const original = new TypeError("Type mismatch");
			const error = new DataTransformationError("Transform failed", original);

			expect((error.details as { originalError: Error }).originalError).toBe(
				original,
			);
		});

		it("captures string as originalError", () => {
			const error = new DataTransformationError(
				"Transform failed",
				"string error",
			);

			expect((error.details as { originalError: string }).originalError).toBe(
				"string error",
			);
		});

		it("captures object as originalError", () => {
			const original = { code: "ERR", data: [1, 2, 3] };
			const error = new DataTransformationError("Transform failed", original);

			expect(error.details).toEqual({ originalError: original });
		});
	});
});
