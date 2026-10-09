import { describe, expect, it } from "vitest";
import {
	normalizeOptionalString,
	normalizeRequiredDate,
	normalizeRequiredNumber,
	normalizeRequiredString,
} from "../normalizers";

describe("normalizeOptionalString", () => {
	describe("with valid string inputs", () => {
		it("returns trimmed string for valid input", () => {
			expect(normalizeOptionalString("hello")).toBe("hello");
		});

		it("trims whitespace from string", () => {
			expect(normalizeOptionalString("  hello world  ")).toBe("hello world");
		});

		it("handles string with only internal whitespace", () => {
			expect(normalizeOptionalString("hello   world")).toBe("hello   world");
		});

		it("converts truthy numbers to strings", () => {
			expect(normalizeOptionalString(123)).toBe("123");
			expect(normalizeOptionalString(-42.5)).toBe("-42.5");
		});

		it("returns undefined for falsy values like 0 and false", () => {
			// The implementation checks `if (!value)` which treats 0 and false as falsy
			expect(normalizeOptionalString(0)).toBeUndefined();
			expect(normalizeOptionalString(false)).toBeUndefined();
		});

		it("converts truthy boolean to string", () => {
			expect(normalizeOptionalString(true)).toBe("true");
		});
	});

	describe("with falsy or object inputs", () => {
		it("returns undefined for null", () => {
			expect(normalizeOptionalString(null)).toBeUndefined();
		});

		it("returns undefined for undefined", () => {
			expect(normalizeOptionalString(undefined)).toBeUndefined();
		});

		it("returns undefined for empty string", () => {
			expect(normalizeOptionalString("")).toBeUndefined();
		});

		it("returns undefined for objects", () => {
			expect(normalizeOptionalString({})).toBeUndefined();
			expect(normalizeOptionalString({ key: "value" })).toBeUndefined();
		});

		it("returns undefined for arrays", () => {
			expect(normalizeOptionalString([])).toBeUndefined();
			expect(normalizeOptionalString(["a", "b"])).toBeUndefined();
		});
	});

	describe("with default value", () => {
		it("returns default value for null", () => {
			expect(normalizeOptionalString(null, "default")).toBe("default");
		});

		it("returns default value for undefined", () => {
			expect(normalizeOptionalString(undefined, "default")).toBe("default");
		});

		it("returns default value for empty string", () => {
			expect(normalizeOptionalString("", "default")).toBe("default");
		});

		it("returns default value for objects", () => {
			expect(normalizeOptionalString({}, "default")).toBe("default");
		});

		it("returns actual value when valid, ignoring default", () => {
			expect(normalizeOptionalString("actual", "default")).toBe("actual");
		});
	});
});

describe("normalizeRequiredString", () => {
	describe("with valid string inputs", () => {
		it("returns trimmed string for valid input", () => {
			expect(normalizeRequiredString("hello")).toBe("hello");
		});

		it("trims whitespace from string", () => {
			expect(normalizeRequiredString("  hello  ")).toBe("hello");
		});

		it("handles empty string (returns empty after trim)", () => {
			expect(normalizeRequiredString("")).toBe("");
		});

		it("handles whitespace-only string", () => {
			expect(normalizeRequiredString("   ")).toBe("");
		});
	});

	describe("with non-string inputs and no default", () => {
		it("throws error for null without default", () => {
			expect(() => normalizeRequiredString(null)).toThrow(
				"Value null is not a string and no default value was provided",
			);
		});

		it("throws error for undefined without default", () => {
			expect(() => normalizeRequiredString(undefined)).toThrow(
				"is not a string and no default value was provided",
			);
		});

		it("throws error for number without default", () => {
			expect(() => normalizeRequiredString(123)).toThrow(
				"Value 123 is not a string and no default value was provided",
			);
		});

		it("throws error for object without default", () => {
			expect(() => normalizeRequiredString({ key: "value" })).toThrow(
				"is not a string and no default value was provided",
			);
		});

		it("throws error for array without default", () => {
			expect(() => normalizeRequiredString(["a"])).toThrow(
				"is not a string and no default value was provided",
			);
		});

		it("throws error for boolean without default", () => {
			expect(() => normalizeRequiredString(true)).toThrow(
				"is not a string and no default value was provided",
			);
		});
	});

	describe("with default value", () => {
		it("returns default value for null", () => {
			expect(normalizeRequiredString(null, "default")).toBe("default");
		});

		it("returns default value for undefined", () => {
			expect(normalizeRequiredString(undefined, "default")).toBe("default");
		});

		it("returns default value for number", () => {
			expect(normalizeRequiredString(42, "default")).toBe("default");
		});

		it("returns default value for object", () => {
			expect(normalizeRequiredString({}, "default")).toBe("default");
		});

		it("returns actual string when valid, ignoring default", () => {
			expect(normalizeRequiredString("actual", "default")).toBe("actual");
		});

		it("returns empty string when input is empty string", () => {
			expect(normalizeRequiredString("", "default")).toBe("");
		});
	});
});

describe("normalizeRequiredNumber", () => {
	describe("with valid number inputs", () => {
		it("returns number for integer", () => {
			expect(normalizeRequiredNumber(42)).toBe(42);
		});

		it("returns number for float", () => {
			expect(normalizeRequiredNumber(Math.PI)).toBe(Math.PI);
		});

		it("returns number for zero", () => {
			expect(normalizeRequiredNumber(0)).toBe(0);
		});

		it("returns number for negative values", () => {
			expect(normalizeRequiredNumber(-100)).toBe(-100);
		});

		it("converts numeric string to number", () => {
			expect(normalizeRequiredNumber("123")).toBe(123);
			expect(normalizeRequiredNumber("3.14")).toBe(3.14);
			expect(normalizeRequiredNumber("-50")).toBe(-50);
		});
	});

	describe("with non-numeric inputs and no default", () => {
		it("returns 0 for null (Number(null) === 0)", () => {
			// Number(null) returns 0, which is not NaN
			expect(normalizeRequiredNumber(null)).toBe(0);
		});

		it("throws error for undefined without default", () => {
			expect(() => normalizeRequiredNumber(undefined)).toThrow(
				"is not a number and no default value was provided",
			);
		});

		it("throws error for non-numeric string without default", () => {
			expect(() => normalizeRequiredNumber("not a number")).toThrow(
				"is not a number and no default value was provided",
			);
		});

		it("returns 0 for empty string (Number('') === 0)", () => {
			// Number('') returns 0, which is not NaN
			expect(normalizeRequiredNumber("")).toBe(0);
		});

		it("throws error for object without default", () => {
			expect(() => normalizeRequiredNumber({})).toThrow(
				"is not a number and no default value was provided",
			);
		});
	});

	describe("with default value", () => {
		it("returns default value for NaN-producing input", () => {
			expect(normalizeRequiredNumber("abc", 100)).toBe(100);
		});

		it("returns 0 for null (Number(null) === 0, ignores default)", () => {
			// Number(null) returns 0, which is not NaN, so default is not used
			expect(normalizeRequiredNumber(null, 50)).toBe(0);
		});

		it("returns default value for undefined", () => {
			expect(normalizeRequiredNumber(undefined, 25)).toBe(25);
		});

		it("returns actual number when valid, ignoring default", () => {
			expect(normalizeRequiredNumber(42, 100)).toBe(42);
		});

		it("returns zero when input is zero (not default)", () => {
			expect(normalizeRequiredNumber(0, 100)).toBe(0);
		});

		it("returns default of zero when specified", () => {
			expect(normalizeRequiredNumber("invalid", 0)).toBe(0);
		});
	});
});

describe("normalizeRequiredDate", () => {
	describe("with Date object inputs", () => {
		it("returns same Date object", () => {
			const date = new Date("2024-06-15T10:30:00.000Z");
			expect(normalizeRequiredDate(date)).toBe(date);
		});

		it("handles Date at epoch", () => {
			const date = new Date(0);
			expect(normalizeRequiredDate(date).getTime()).toBe(0);
		});
	});

	describe("with ISO string inputs", () => {
		it("parses full ISO datetime string", () => {
			const result = normalizeRequiredDate("2024-06-15T10:30:00.000Z");
			expect(result.toISOString()).toBe("2024-06-15T10:30:00.000Z");
		});

		it("parses ISO datetime with timezone offset", () => {
			const result = normalizeRequiredDate("2024-06-15T10:30:00+02:00");
			expect(result instanceof Date).toBe(true);
			expect(result.getTime()).toBe(
				new Date("2024-06-15T08:30:00.000Z").getTime(),
			);
		});
	});

	describe("with date-only string inputs", () => {
		it("parses date-only string and assumes UTC midnight", () => {
			const result = normalizeRequiredDate("2024-06-15");
			expect(result.toISOString()).toBe("2024-06-15T00:00:00.000Z");
		});

		it("parses date with different format", () => {
			const result = normalizeRequiredDate("2024-12-31");
			expect(result.toISOString()).toBe("2024-12-31T00:00:00.000Z");
		});
	});

	describe("with invalid inputs", () => {
		it("throws error for invalid date string", () => {
			expect(() => normalizeRequiredDate("not-a-date")).toThrow(
				'Value "not-a-date" is not a valid publication date',
			);
		});

		it("throws error for null", () => {
			expect(() => normalizeRequiredDate(null)).toThrow(
				"is not a string and no default value was provided",
			);
		});

		it("throws error for undefined", () => {
			expect(() => normalizeRequiredDate(undefined)).toThrow(
				"is not a string and no default value was provided",
			);
		});

		it("throws error for number", () => {
			expect(() => normalizeRequiredDate(12345)).toThrow(
				"is not a string and no default value was provided",
			);
		});

		it("throws error for empty string", () => {
			expect(() => normalizeRequiredDate("")).toThrow(
				'Value "" is not a valid publication date',
			);
		});

		it("throws error for malformed date", () => {
			expect(() => normalizeRequiredDate("2024-13-45")).toThrow(
				"is not a valid publication date",
			);
		});
	});

	describe("edge cases", () => {
		it("handles string with leading/trailing whitespace", () => {
			const result = normalizeRequiredDate("  2024-06-15  ");
			expect(result.toISOString()).toBe("2024-06-15T00:00:00.000Z");
		});

		it("handles leap year date", () => {
			const result = normalizeRequiredDate("2024-02-29");
			expect(result.toISOString()).toBe("2024-02-29T00:00:00.000Z");
		});
	});
});
