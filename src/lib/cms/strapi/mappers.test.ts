import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
	mapArticleToDetail,
	mapArticleToSummary,
	mapSingletonToPage,
} from "./mappers";
import {
	parseArticleEntity,
	parseSingletonEntity,
	parseStrapiList,
} from "./schemas";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturePath = path.join(__dirname, "__fixtures__", "article.json");

describe("mapArticleToSummary", () => {
	it("maps fixture article from Strapi 5 shape", () => {
		const raw = JSON.parse(fs.readFileSync(fixturePath, "utf8")) as unknown;
		const entity = parseArticleEntity(raw);
		const summary = mapArticleToSummary("http://localhost:1337", entity);
		expect(summary.slug).toBe("fixture-article");
		expect(summary.title).toBe("Fixture article");
		expect(summary.description).toBe("Fixture meta description for SEO.");
		expect(summary.heroImageUrl).toBe(
			"http://localhost:1337/uploads/preview_abc.jpg",
		);
		expect(summary.heroImageAlt).toBe("Preview alt");
	});
});

describe("mapArticleToDetail", () => {
	it("includes rendered body HTML", () => {
		const raw = JSON.parse(fs.readFileSync(fixturePath, "utf8")) as unknown;
		const entity = parseArticleEntity(raw);
		const detail = mapArticleToDetail("http://localhost:1337", entity);
		expect(detail.bodyHtml).toContain("<p>Summary line for the card.</p>");
		expect(detail.bodyHtml).toContain("Body paragraph.");
	});
});

describe("parseStrapiList", () => {
	it("parses list envelope", () => {
		const parsed = parseStrapiList({
			data: [
				{
					documentId: "a",
					title: "t",
					slug: "s",
					publicationDate: "2024-01-01",
				},
			],
			meta: {},
		});
		expect(parsed.data).toHaveLength(1);
	});
});

describe("mapSingletonToPage", () => {
	it("maps singleton with hero picture component", () => {
		const raw = {
			documentId: "home1",
			title: "Site",
			heading: "Welcome",
			subHeading: "Sub",
			slug: "home",
			publishedAt: "2024-01-01T00:00:00.000Z",
			metaData: { metaTitle: "MT", metaDescription: "MD" },
			content: [],
			heroImage: {
				__component: "sections.picture",
				altText: "Hero",
				image: { url: "/uploads/hero.png" },
			},
		};
		const entity = parseSingletonEntity(raw);
		const page = mapSingletonToPage("http://localhost:1337", entity);
		expect(page.heroImageUrl).toBe("http://localhost:1337/uploads/hero.png");
		expect(page.publishedAt?.toISOString()).toContain("2024-01-01");
	});
});
