import { describe, expect, it } from "vitest";
import { IMAGE_FORMAT_NAMES } from "../../models";
import { isImageFormatName, isRecord } from "../checkers";

describe("isRecord", () => {
	it("returns true for plain objects", () => {
		expect(isRecord({})).toBe(true);
		expect(isRecord({ a: 1 })).toBe(true);
	});

	it("returns true for objects with null prototype", () => {
		expect(isRecord(Object.create(null))).toBe(true);
	});

	it("returns false for null", () => {
		expect(isRecord(null)).toBe(false);
	});

	it("returns false for arrays", () => {
		expect(isRecord([])).toBe(false);
		expect(isRecord([1, 2])).toBe(false);
	});

	it("returns false for primitives", () => {
		expect(isRecord(undefined)).toBe(false);
		expect(isRecord("")).toBe(false);
		expect(isRecord(0)).toBe(false);
		expect(isRecord(false)).toBe(false);
		expect(isRecord(Symbol("x"))).toBe(false);
	});

	it("returns false for functions", () => {
		expect(isRecord(() => {})).toBe(false);
		expect(isRecord(function named() {})).toBe(false);
	});
});

describe("isImageFormatName", () => {
	it("returns true for each known CMS image format key", () => {
		for (const name of IMAGE_FORMAT_NAMES) {
			expect(isImageFormatName(name)).toBe(true);
		}
	});

	it("returns false for strings that are not format keys", () => {
		expect(isImageFormatName("xlarge")).toBe(false);
		expect(isImageFormatName("")).toBe(false);
		expect(isImageFormatName("thumbnail ")).toBe(false);
	});

	it("returns false when casing does not match exactly", () => {
		expect(isImageFormatName("Thumbnail")).toBe(false);
		expect(isImageFormatName("SMALL")).toBe(false);
	});
});
