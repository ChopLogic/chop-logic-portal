import { describe, expect, it } from "vitest";
import { isImageFormatName, isRecord } from "../checkers";

describe("isRecord", () => {
	describe("returns true for valid records", () => {
		it("returns true for empty object", () => {
			expect(isRecord({})).toBe(true);
		});

		it("returns true for object with string keys", () => {
			expect(isRecord({ key: "value" })).toBe(true);
		});

		it("returns true for object with mixed value types", () => {
			expect(
				isRecord({
					string: "hello",
					number: 42,
					boolean: true,
					nested: { inner: "value" },
					array: [1, 2, 3],
				}),
			).toBe(true);
		});

		it("returns true for object created with Object.create(null)", () => {
			const obj = Object.create(null);
			obj.key = "value";
			expect(isRecord(obj)).toBe(true);
		});

		it("returns true for class instance", () => {
			class TestClass {
				prop = "value";
			}
			expect(isRecord(new TestClass())).toBe(true);
		});
	});

	describe("returns false for non-records", () => {
		it("returns false for null", () => {
			expect(isRecord(null)).toBe(false);
		});

		it("returns false for undefined", () => {
			expect(isRecord(undefined)).toBe(false);
		});

		it("returns false for arrays", () => {
			expect(isRecord([])).toBe(false);
			expect(isRecord([1, 2, 3])).toBe(false);
			expect(isRecord(["a", "b"])).toBe(false);
		});

		it("returns false for strings", () => {
			expect(isRecord("hello")).toBe(false);
			expect(isRecord("")).toBe(false);
		});

		it("returns false for numbers", () => {
			expect(isRecord(42)).toBe(false);
			expect(isRecord(0)).toBe(false);
			expect(isRecord(NaN)).toBe(false);
			expect(isRecord(Infinity)).toBe(false);
		});

		it("returns false for booleans", () => {
			expect(isRecord(true)).toBe(false);
			expect(isRecord(false)).toBe(false);
		});

		it("returns false for functions", () => {
			expect(isRecord(() => {})).toBe(false);
			expect(isRecord(function named() {})).toBe(false);
		});

		it("returns false for symbols", () => {
			expect(isRecord(Symbol("test"))).toBe(false);
		});

		it("returns false for bigint", () => {
			expect(isRecord(BigInt(123))).toBe(false);
		});
	});

	describe("edge cases", () => {
		it("returns true for Date objects (they are objects)", () => {
			expect(isRecord(new Date())).toBe(true);
		});

		it("returns true for RegExp objects (they are objects)", () => {
			expect(isRecord(/test/)).toBe(true);
		});

		it("returns true for Map objects (they are objects)", () => {
			expect(isRecord(new Map())).toBe(true);
		});

		it("returns true for Set objects (they are objects)", () => {
			expect(isRecord(new Set())).toBe(true);
		});
	});
});

describe("isImageFormatName", () => {
	describe("returns true for valid format names", () => {
		it("returns true for 'thumbnail'", () => {
			expect(isImageFormatName("thumbnail")).toBe(true);
		});

		it("returns true for 'small'", () => {
			expect(isImageFormatName("small")).toBe(true);
		});

		it("returns true for 'medium'", () => {
			expect(isImageFormatName("medium")).toBe(true);
		});

		it("returns true for 'large'", () => {
			expect(isImageFormatName("large")).toBe(true);
		});
	});

	describe("returns false for invalid format names", () => {
		it("returns false for empty string", () => {
			expect(isImageFormatName("")).toBe(false);
		});

		it("returns false for unknown format names", () => {
			expect(isImageFormatName("xlarge")).toBe(false);
			expect(isImageFormatName("tiny")).toBe(false);
			expect(isImageFormatName("original")).toBe(false);
			expect(isImageFormatName("preview")).toBe(false);
		});

		it("returns false for uppercase variants", () => {
			expect(isImageFormatName("SMALL")).toBe(false);
			expect(isImageFormatName("Small")).toBe(false);
			expect(isImageFormatName("THUMBNAIL")).toBe(false);
		});

		it("returns false for format names with whitespace", () => {
			expect(isImageFormatName(" small")).toBe(false);
			expect(isImageFormatName("small ")).toBe(false);
			expect(isImageFormatName(" small ")).toBe(false);
		});

		it("returns false for partial matches", () => {
			expect(isImageFormatName("smal")).toBe(false);
			expect(isImageFormatName("thumb")).toBe(false);
		});

		it("returns false for numeric strings", () => {
			expect(isImageFormatName("123")).toBe(false);
			expect(isImageFormatName("0")).toBe(false);
		});
	});
});
