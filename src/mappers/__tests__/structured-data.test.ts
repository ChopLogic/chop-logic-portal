import type { JsonValue } from "@models";
import { describe, expect, it } from "vitest";
import { mapStructuredDataToJsonLdHtml } from "../structured-data";

describe("mapStructuredDataToJsonLdHtml", () => {
	describe("with object inputs", () => {
		it("serializes simple object to JSON string", () => {
			const input = { "@type": "Article", name: "Test Article" };
			const result = mapStructuredDataToJsonLdHtml(input);

			expect(result).toBe('{"@type":"Article","name":"Test Article"}');
		});

		it("serializes nested object structure", () => {
			const input = {
				"@context": "https://schema.org",
				"@type": "Article",
				author: {
					"@type": "Person",
					name: "John Doe",
				},
			};
			const result = mapStructuredDataToJsonLdHtml(input);

			expect(result).toContain('"@context":"https://schema.org"');
			expect(result).toContain('"@type":"Article"');
			expect(result).toContain('"author":{');
		});

		it("serializes array values", () => {
			const input = {
				"@type": "Article",
				keywords: ["javascript", "testing", "vitest"],
			};
			const result = mapStructuredDataToJsonLdHtml(input);

			expect(result).toContain('["javascript","testing","vitest"]');
		});

		it("handles empty object", () => {
			const result = mapStructuredDataToJsonLdHtml({});

			expect(result).toBe("{}");
		});
	});

	describe("with string inputs", () => {
		it("parses valid JSON string and re-serializes", () => {
			const input = '{"@type":"Article","name":"Test"}';
			const result = mapStructuredDataToJsonLdHtml(input);

			expect(result).toBe('{"@type":"Article","name":"Test"}');
		});

		it("handles JSON string with extra whitespace", () => {
			const input = '  { "@type": "Article" }  ';
			const result = mapStructuredDataToJsonLdHtml(input);

			expect(result).toBe('{"@type":"Article"}');
		});

		it("returns null for invalid JSON string", () => {
			const result = mapStructuredDataToJsonLdHtml("not valid json");

			expect(result).toBeNull();
		});

		it("returns null for JSON syntax error", () => {
			const result = mapStructuredDataToJsonLdHtml('{"key": value}');

			expect(result).toBeNull();
		});

		it("returns null for empty string", () => {
			const result = mapStructuredDataToJsonLdHtml("");

			expect(result).toBeNull();
		});

		it("returns null for whitespace-only string", () => {
			expect(mapStructuredDataToJsonLdHtml("   ")).toBeNull();
			expect(mapStructuredDataToJsonLdHtml("\t\n")).toBeNull();
		});
	});

	describe("with null/undefined inputs", () => {
		it("returns null for null input", () => {
			const result = mapStructuredDataToJsonLdHtml(null);

			expect(result).toBeNull();
		});

		it("returns null for undefined input", () => {
			const result = mapStructuredDataToJsonLdHtml(undefined);

			expect(result).toBeNull();
		});
	});

	describe("with primitive inputs", () => {
		it("returns null for number input", () => {
			const result = mapStructuredDataToJsonLdHtml(123 as unknown as JsonValue);

			expect(result).toBeNull();
		});

		it("returns null for boolean input", () => {
			const result = mapStructuredDataToJsonLdHtml(
				true as unknown as JsonValue,
			);

			expect(result).toBeNull();
		});
	});

	describe("HTML escaping", () => {
		it("escapes < characters to prevent XSS", () => {
			const input = {
				description: "Use <script>alert('xss')</script> safely",
			};
			const result = mapStructuredDataToJsonLdHtml(input);

			expect(result).not.toContain("<");
			expect(result).toContain("\\u003c");
		});

		it("escapes multiple < characters", () => {
			const input = {
				content: "<div><span>Test</span></div>",
			};
			const result = mapStructuredDataToJsonLdHtml(input);

			const lessThanCount = (result?.match(/\\u003c/g) || []).length;
			expect(lessThanCount).toBe(4); // <div>, <span>, </span>, </div>
		});

		it("does not escape > characters", () => {
			const input = {
				content: "a > b",
			};
			const result = mapStructuredDataToJsonLdHtml(input);

			expect(result).toContain(">");
		});

		it("handles content without HTML characters", () => {
			const input = {
				name: "Plain text content",
			};
			const result = mapStructuredDataToJsonLdHtml(input);

			expect(result).toBe('{"name":"Plain text content"}');
		});
	});

	describe("complex structured data", () => {
		it("handles typical Article schema", () => {
			const input = {
				"@context": "https://schema.org",
				"@type": "Article",
				headline: "Test Article Headline",
				author: {
					"@type": "Person",
					name: "John Doe",
					url: "https://example.com/author/john",
				},
				datePublished: "2024-06-15T10:00:00Z",
				dateModified: "2024-06-16T14:30:00Z",
				image: [
					"https://example.com/image1.jpg",
					"https://example.com/image2.jpg",
				],
			};
			const result = mapStructuredDataToJsonLdHtml(input);

			expect(result).toContain('"@context":"https://schema.org"');
			expect(result).toContain('"headline":"Test Article Headline"');
			expect(result).toContain('"datePublished":"2024-06-15T10:00:00Z"');
		});

		it("handles BreadcrumbList schema", () => {
			const input = {
				"@context": "https://schema.org",
				"@type": "BreadcrumbList",
				itemListElement: [
					{
						"@type": "ListItem",
						position: 1,
						name: "Home",
						item: "https://example.com",
					},
					{
						"@type": "ListItem",
						position: 2,
						name: "Blog",
						item: "https://example.com/blog",
					},
				],
			};
			const result = mapStructuredDataToJsonLdHtml(input);

			expect(result).toContain('"@type":"BreadcrumbList"');
			expect(result).toContain('"position":1');
			expect(result).toContain('"position":2');
		});

		it("handles WebSite schema with search action", () => {
			const input = {
				"@context": "https://schema.org",
				"@type": "WebSite",
				url: "https://example.com",
				potentialAction: {
					"@type": "SearchAction",
					target: "https://example.com/search?q={search_term}",
					"query-input": "required name=search_term",
				},
			};
			const result = mapStructuredDataToJsonLdHtml(input);

			expect(result).toContain('"@type":"WebSite"');
			expect(result).toContain('"potentialAction"');
		});
	});

	describe("edge cases", () => {
		it("handles array as top-level input", () => {
			const input = [
				{ "@type": "Article", name: "Article 1" },
				{ "@type": "Article", name: "Article 2" },
			];
			const result = mapStructuredDataToJsonLdHtml(input);

			expect(result).toContain('[{"@type":"Article"');
		});

		it("handles deeply nested structures", () => {
			const input = {
				level1: {
					level2: {
						level3: {
							level4: {
								value: "deep",
							},
						},
					},
				},
			};
			const result = mapStructuredDataToJsonLdHtml(input);

			expect(result).toContain('"value":"deep"');
		});

		it("handles special characters in values", () => {
			const input = {
				description: 'Quote: "Hello" and backslash: \\',
			};
			const result = mapStructuredDataToJsonLdHtml(input);

			expect(result).toContain('\\"Hello\\"');
		});

		it("handles unicode characters", () => {
			const input = {
				name: "日本語タイトル",
				emoji: "🎉",
			};
			const result = mapStructuredDataToJsonLdHtml(input);

			expect(result).toContain("日本語タイトル");
			expect(result).toContain("🎉");
		});

		it("handles numeric string that looks like JSON", () => {
			const result = mapStructuredDataToJsonLdHtml("123");

			expect(result).toBeNull(); // primitive, not object
		});

		it("handles string array JSON", () => {
			const result = mapStructuredDataToJsonLdHtml('["a", "b", "c"]');

			expect(result).toBe('["a","b","c"]');
		});
	});
});
