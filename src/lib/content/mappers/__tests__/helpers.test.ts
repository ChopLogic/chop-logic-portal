import { describe, expect, it } from "vitest";
import { normalizeOptionalString, normalizeRequiredString } from "../helpers";

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
