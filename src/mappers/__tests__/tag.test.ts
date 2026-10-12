import { beforeEach, describe, expect, it, vi } from "vitest";
import { mapTags } from "../tag";
import {
	createMinimalTagResponse,
	createMockTagResponse,
	createMockTagsArray,
	createTagWithoutOptionalFields,
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
	normalizeOptionalString: vi.fn((v, d) => {
		if (!v || typeof v === "object") return d;
		return String(v).trim();
	}),
}));

describe("mapTags", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("with valid tag arrays", () => {
		it("maps single tag correctly", () => {
			const raw = [createMockTagResponse()];
			const result = mapTags(raw);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				id: "tag-doc-123",
				name: "JavaScript",
				slug: "javascript",
				description: "Articles about JavaScript programming",
				color: "#f7df1e",
			});
		});

		it("maps multiple tags correctly", () => {
			const raw = createMockTagsArray(3);
			const result = mapTags(raw);

			expect(result).toHaveLength(3);
			expect(result[0]?.name).toBe("JavaScript");
			expect(result[1]?.name).toBe("TypeScript");
			expect(result[2]?.name).toBe("React");
		});

		it("maps minimal tag without optional fields", () => {
			const raw = [createMinimalTagResponse()];
			const result = mapTags(raw);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				id: "tag-minimal-123",
				name: "Minimal Tag",
				slug: "minimal-tag",
				description: undefined,
				color: undefined,
			});
		});

		it("handles tag without optional fields", () => {
			const raw = [createTagWithoutOptionalFields()];
			const result = mapTags(raw);

			expect(result[0]?.description).toBeUndefined();
			expect(result[0]?.color).toBeUndefined();
		});

		it("returns empty array for empty input array", () => {
			const result = mapTags([]);

			expect(result).toHaveLength(0);
		});
	});

	describe("with invalid inputs", () => {
		it("throws error for null input", () => {
			expect(() => mapTags(null)).toThrow("Invalid tags array provided: null");
		});

		it("throws error for undefined input", () => {
			expect(() => mapTags(undefined)).toThrow(
				"Invalid tags array provided: undefined",
			);
		});
	});

	describe("with invalid tag items", () => {
		it("throws error for non-record item", () => {
			const raw = ["string"];

			expect(() => mapTags(raw)).toThrow('Expected a record, got "string"');
		});

		it("throws error for null item in array", () => {
			const raw = [createMockTagResponse(), null];

			expect(() => mapTags(raw)).toThrow("Expected a record, got null");
		});

		it("throws error for number item in array", () => {
			const raw = [createMockTagResponse(), 123];

			expect(() => mapTags(raw)).toThrow("Expected a record, got 123");
		});

		it("throws error for array item in array", () => {
			const raw = [createMockTagResponse(), [1, 2, 3]];

			expect(() => mapTags(raw)).toThrow("Expected a record, got [1,2,3]");
		});
	});

	describe("field mapping", () => {
		it("maps documentId to id", () => {
			const raw = [createMockTagResponse({ documentId: "custom-doc-id" })];
			const result = mapTags(raw);

			expect(result[0]?.id).toBe("custom-doc-id");
		});

		it("preserves name field", () => {
			const raw = [createMockTagResponse({ name: "Custom Name" })];
			const result = mapTags(raw);

			expect(result[0]?.name).toBe("Custom Name");
		});

		it("preserves slug field", () => {
			const raw = [createMockTagResponse({ slug: "custom-slug" })];
			const result = mapTags(raw);

			expect(result[0]?.slug).toBe("custom-slug");
		});

		it("preserves description field", () => {
			const raw = [
				createMockTagResponse({ description: "Custom description" }),
			];
			const result = mapTags(raw);

			expect(result[0]?.description).toBe("Custom description");
		});

		it("preserves color field", () => {
			const raw = [createMockTagResponse({ color: "#ff0000" })];
			const result = mapTags(raw);

			expect(result[0]?.color).toBe("#ff0000");
		});
	});

	describe("edge cases", () => {
		it("handles large number of tags", () => {
			const raw = createMockTagsArray(100);
			const result = mapTags(raw);

			expect(result).toHaveLength(100);
		});

		it("handles tags with special characters in values", () => {
			const raw = [
				createMockTagResponse({
					name: "C++ & C#",
					slug: "cpp-csharp",
					description: "Tags with <special> characters & symbols",
				}),
			];
			const result = mapTags(raw);

			expect(result[0]?.name).toBe("C++ & C#");
			expect(result[0]?.description).toBe(
				"Tags with <special> characters & symbols",
			);
		});

		it("handles tags with unicode characters", () => {
			const raw = [
				createMockTagResponse({
					name: "日本語タグ",
					slug: "japanese-tag",
				}),
			];
			const result = mapTags(raw);

			expect(result[0]?.name).toBe("日本語タグ");
		});
	});
});
