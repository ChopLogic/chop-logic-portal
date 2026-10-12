import { beforeEach, describe, expect, it, vi } from "vitest";
import { mapArticleAuthorConnections } from "../author";
import {
	createAuthorWithoutAvatar,
	createMinimalAuthorConnection,
	createMockAuthorConnection,
	createMockAuthorsArray,
} from "./fixtures";

// Mock dependencies
vi.mock("../checkers", () => ({
	isRecord: vi.fn(
		(v) => typeof v === "object" && v !== null && !Array.isArray(v),
	),
}));

vi.mock("../normalizers", () => ({
	normalizeRequiredString: vi.fn((v, d) => {
		if (typeof v === "string") return String(v).trim();
		if (!d) throw new Error(`Value ${JSON.stringify(v)} is not a string`);
		return d;
	}),
}));

const mockMapCmsImage = vi.fn();
vi.mock("../image", () => ({
	mapCmsImage: (...args: unknown[]) => mockMapCmsImage(...args),
}));

const TEST_API_URL = "https://api.example.com";

describe("mapArticleAuthorConnections", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockMapCmsImage.mockImplementation((raw) => {
			if (!raw) return null;
			return {
				documentId: raw.documentId || "mock-avatar-id",
				name: raw.name || "avatar.jpg",
				url: raw.url || "/avatar.jpg",
				width: raw.width || 400,
				height: raw.height || 400,
				formats: raw.formats || {},
			};
		});
	});

	describe("with valid author arrays", () => {
		it("maps single author correctly", () => {
			const raw = [createMockAuthorConnection()];
			const result = mapArticleAuthorConnections(raw, TEST_API_URL);

			expect(result).toHaveLength(1);
			expect(result[0]?.id).toBe("author-doc-123");
			expect(result[0]?.name).toBe("John Doe");
			expect(result[0]?.email).toBe("john.doe@example.com");
		});

		it("maps multiple authors correctly", () => {
			const raw = createMockAuthorsArray(3);
			const result = mapArticleAuthorConnections(raw, TEST_API_URL);

			expect(result).toHaveLength(3);
			expect(result[0]?.name).toBe("John Doe");
			expect(result[1]?.name).toBe("Jane Smith");
			expect(result[2]?.name).toBe("Bob Wilson");
		});

		it("maps author with avatar", () => {
			const raw = [createMockAuthorConnection()];
			const result = mapArticleAuthorConnections(raw, TEST_API_URL);

			expect(result[0]?.avatar).not.toBeNull();
			expect(mockMapCmsImage).toHaveBeenCalled();
		});

		it("handles author without avatar", () => {
			mockMapCmsImage.mockReturnValue(null);
			const raw = [createAuthorWithoutAvatar()];
			const result = mapArticleAuthorConnections(raw, TEST_API_URL);

			expect(result[0]?.avatar).toBeNull();
		});

		it("returns empty array for empty input array", () => {
			const result = mapArticleAuthorConnections([], TEST_API_URL);

			expect(result).toHaveLength(0);
		});
	});

	describe("with invalid inputs", () => {
		it("throws error for null input", () => {
			expect(() => mapArticleAuthorConnections(null, TEST_API_URL)).toThrow(
				"Invalid article to authors array provided: null",
			);
		});

		it("throws error for undefined input", () => {
			expect(() =>
				mapArticleAuthorConnections(undefined, TEST_API_URL),
			).toThrow("Invalid article to authors array provided: undefined");
		});
	});

	describe("with invalid author items", () => {
		it("throws error for non-record item", () => {
			const raw = ["string"];

			expect(() => mapArticleAuthorConnections(raw, TEST_API_URL)).toThrow(
				'Expected a record, got "string"',
			);
		});

		it("throws error for null item in array", () => {
			const raw = [createMockAuthorConnection(), null];

			expect(() => mapArticleAuthorConnections(raw, TEST_API_URL)).toThrow(
				"Expected a record, got null",
			);
		});

		it("throws error for number item in array", () => {
			const raw = [123];

			expect(() => mapArticleAuthorConnections(raw, TEST_API_URL)).toThrow(
				"Expected a record, got 123",
			);
		});
	});

	describe("field mapping", () => {
		it("maps documentId to id", () => {
			const raw = [
				createMockAuthorConnection({ documentId: "custom-author-id" }),
			];
			const result = mapArticleAuthorConnections(raw, TEST_API_URL);

			expect(result[0]?.id).toBe("custom-author-id");
		});

		it("preserves name field", () => {
			const raw = [createMockAuthorConnection({ name: "Custom Author Name" })];
			const result = mapArticleAuthorConnections(raw, TEST_API_URL);

			expect(result[0]?.name).toBe("Custom Author Name");
		});

		it("preserves email field", () => {
			const raw = [createMockAuthorConnection({ email: "custom@email.com" })];
			const result = mapArticleAuthorConnections(raw, TEST_API_URL);

			expect(result[0]?.email).toBe("custom@email.com");
		});
	});

	describe("avatar mapping", () => {
		it("calls mapCmsImage with avatar data and API URL", () => {
			const raw = [createMockAuthorConnection()];
			mapArticleAuthorConnections(raw, TEST_API_URL);

			expect(mockMapCmsImage).toHaveBeenCalledWith(
				expect.any(Object),
				TEST_API_URL,
			);
		});

		it("passes null avatar to mapCmsImage", () => {
			const raw = [createAuthorWithoutAvatar()];
			mapArticleAuthorConnections(raw, TEST_API_URL);

			expect(mockMapCmsImage).toHaveBeenCalledWith(null, TEST_API_URL);
		});
	});

	describe("edge cases", () => {
		it("handles minimal author connection", () => {
			const raw = [createMinimalAuthorConnection()];
			const result = mapArticleAuthorConnections(raw, TEST_API_URL);

			expect(result[0]?.id).toBe("author-minimal-123");
			expect(result[0]?.name).toBe("Jane Smith");
			expect(result[0]?.email).toBe("jane.smith@example.com");
		});

		it("handles author with special characters in name", () => {
			const raw = [
				createMockAuthorConnection({
					name: "José García-López",
					email: "jose@example.com",
				}),
			];
			const result = mapArticleAuthorConnections(raw, TEST_API_URL);

			expect(result[0]?.name).toBe("José García-López");
		});

		it("handles large number of authors", () => {
			const raw = createMockAuthorsArray(50);
			const result = mapArticleAuthorConnections(raw, TEST_API_URL);

			expect(result).toHaveLength(50);
		});
	});
});
