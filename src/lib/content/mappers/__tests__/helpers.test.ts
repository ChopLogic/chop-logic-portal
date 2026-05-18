import { describe, expect, it } from "vitest";
import {
	normalizeOptionalString,
	normalizeRequiredDate,
	normalizeRequiredNumber,
	normalizeRequiredString,
} from "../helpers";

describe("normalizeOptionalString", () => {
	it("returns trimmed string for non-empty string input", () => {
		expect(normalizeOptionalString("  hello  ")).toBe("hello");
	});

	it("returns defaultValue when value is falsy", () => {
		expect(normalizeOptionalString(undefined, "d")).toBe("d");
		expect(normalizeOptionalString(null, "d")).toBe("d");
		expect(normalizeOptionalString("", "d")).toBe("d");
		expect(normalizeOptionalString(0, "d")).toBe("d");
		expect(normalizeOptionalString(false, "d")).toBe("d");
	});

	it("returns undefined when value is falsy and no default is passed", () => {
		expect(normalizeOptionalString(undefined)).toBeUndefined();
		expect(normalizeOptionalString(null)).toBeUndefined();
		expect(normalizeOptionalString("")).toBeUndefined();
		expect(normalizeOptionalString(0)).toBeUndefined();
	});

	it("returns defaultValue when value is an object (including arrays)", () => {
		expect(normalizeOptionalString({}, "x")).toBe("x");
		expect(normalizeOptionalString([], "x")).toBe("x");
		expect(normalizeOptionalString({ a: 1 })).toBeUndefined();
	});

	it("stringifies and trims other truthy non-objects", () => {
		expect(normalizeOptionalString(42)).toBe("42");
		expect(normalizeOptionalString(true)).toBe("true");
	});

	it("trims whitespace-only string to empty string (still truthy before trim)", () => {
		expect(normalizeOptionalString("   ")).toBe("");
	});
});

describe("normalizeRequiredDate", () => {
	it("returns Date when passed a Date instance", () => {
		const d = new Date("2026-03-04T12:00:00.000Z");
		expect(normalizeRequiredDate(d)).toBe(d);
	});

	it("parses YYYY-MM-DD to UTC midnight", () => {
		expect(normalizeRequiredDate("2026-03-04")).toEqual(
			new Date("2026-03-04T00:00:00.000Z"),
		);
	});

	it("accepts full ISO date-times unchanged", () => {
		expect(normalizeRequiredDate("2026-03-04T12:34:56.000Z")).toEqual(
			new Date("2026-03-04T12:34:56.000Z"),
		);
	});

	it("throws for invalid date strings", () => {
		expect(() => normalizeRequiredDate("not-a-date")).toThrow(
			/is not a valid publication date/,
		);
	});
});

describe("normalizeRequiredString", () => {
	it("returns trimmed string when value is a string", () => {
		expect(normalizeRequiredString("  x  ")).toBe("x");
		expect(normalizeRequiredString("")).toBe("");
	});

	it("throws when value is not a string and no default is provided", () => {
		expect(() => normalizeRequiredString(null)).toThrow(
			/is not a string and no default value was provided/,
		);
		expect(() => normalizeRequiredString(undefined)).toThrow(
			/is not a string and no default value was provided/,
		);
		expect(() => normalizeRequiredString(0)).toThrow(
			/is not a string and no default value was provided/,
		);
		expect(() => normalizeRequiredString(99)).toThrow(
			/is not a string and no default value was provided/,
		);
		expect(() => normalizeRequiredString({})).toThrow(
			/is not a string and no default value was provided/,
		);
	});

	it("returns default when value is not a string but default is provided", () => {
		expect(normalizeRequiredString(null, "fallback")).toBe("fallback");
		expect(normalizeRequiredString(undefined, "fallback")).toBe("fallback");
		expect(normalizeRequiredString(0, "fallback")).toBe("fallback");
		expect(normalizeRequiredString(42, "fallback")).toBe("fallback");
	});

	it("does not trim the default value (default is returned as-is)", () => {
		expect(normalizeRequiredString(null, "  padded  ")).toBe("  padded  ");
	});
});

describe("normalizeRequiredNumber", () => {
	it("parses numeric strings and finite numbers", () => {
		expect(normalizeRequiredNumber(42)).toBe(42);
		expect(normalizeRequiredNumber(" 99 ")).toBe(99);
		expect(normalizeRequiredNumber(0)).toBe(0);
		expect(normalizeRequiredNumber(-3.5)).toBe(-3.5);
	});

	it("coerces null and empty string to 0 via Number()", () => {
		expect(normalizeRequiredNumber(null)).toBe(0);
		expect(normalizeRequiredNumber("")).toBe(0);
	});

	it("throws when value is NaN and no default is provided", () => {
		expect(() => normalizeRequiredNumber(undefined)).toThrow(
			/is not a number and no default value was provided/,
		);
		expect(() => normalizeRequiredNumber(Number.NaN)).toThrow(
			/is not a number and no default value was provided/,
		);
		expect(() => normalizeRequiredNumber("not-a-number")).toThrow(
			/is not a number and no default value was provided/,
		);
		expect(() => normalizeRequiredNumber({})).toThrow(
			/is not a number and no default value was provided/,
		);
	});

	it("returns default when Number(value) is NaN and default is provided", () => {
		expect(normalizeRequiredNumber(undefined, 10)).toBe(10);
		expect(normalizeRequiredNumber("x", 0)).toBe(0);
		expect(normalizeRequiredNumber(Number.NaN, -1)).toBe(-1);
	});

	it("returns parsed number when value is valid even if default is provided", () => {
		expect(normalizeRequiredNumber("5", 999)).toBe(5);
	});
});
