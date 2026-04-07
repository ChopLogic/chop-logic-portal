import { describe, expect, it } from "vitest";
import type { JsonValue } from "../../models/json";
import { mapStructuredDataToJsonLdHtml } from "../structured-data";

describe("mapStructuredDataToJsonLdHtml", () => {
	it("returns null for undefined", () => {
		expect(mapStructuredDataToJsonLdHtml(undefined)).toBeNull();
	});

	it("serializes object and escapes angle brackets", () => {
		const html = mapStructuredDataToJsonLdHtml({
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
		const html = mapStructuredDataToJsonLdHtml(raw);
		expect(html).toContain("BlogPosting");
	});

	it("returns null for invalid JSON string", () => {
		expect(mapStructuredDataToJsonLdHtml("{not json")).toBeNull();
	});

	it("returns null for primitive root", () => {
		expect(mapStructuredDataToJsonLdHtml(42 as JsonValue)).toBeNull();
	});
});
