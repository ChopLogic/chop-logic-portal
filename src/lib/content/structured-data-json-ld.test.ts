import { describe, expect, it } from "vitest";
import type { JsonValue } from "./models/json";
import { structuredDataToJsonLdHtml } from "./structured-data-json-ld";

describe("structuredDataToJsonLdHtml", () => {
	it("returns null for undefined", () => {
		expect(structuredDataToJsonLdHtml(undefined)).toBeNull();
	});

	it("serializes object and escapes angle brackets", () => {
		const html = structuredDataToJsonLdHtml({
			"@context": "https://schema.org",
			"@type": "Article",
			headline: "Test",
		});
		expect(html).toContain('"@type":"Article"');
		expect(html).not.toContain("<");
	});

	it("parses JSON string from CMS", () => {
		const raw = JSON.stringify({
			"@context": "https://schema.org",
			"@type": "BlogPosting",
			headline: "Hi",
		});
		const html = structuredDataToJsonLdHtml(raw);
		expect(html).toContain("BlogPosting");
	});

	it("returns null for invalid JSON string", () => {
		expect(structuredDataToJsonLdHtml("{not json")).toBeNull();
	});

	it("returns null for primitive root", () => {
		expect(structuredDataToJsonLdHtml(42 as JsonValue)).toBeNull();
	});
});
