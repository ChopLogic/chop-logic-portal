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
const articlesMockPath = path.join(
	__dirname,
	"__mocks__",
	"fetch-all-articles-projection.json",
);

const previewFixture = {
	documentId: "pv1",
	name: "preview.jpg",
	url: "/uploads/preview_abc.jpg",
	width: 800,
	height: 600,
	alternativeText: "Preview alt",
	caption: null,
	formats: {},
};

describe("mapArticleToSummary", () => {
	it("maps GraphQL-shaped article from mock projection", () => {
		const root = JSON.parse(fs.readFileSync(articlesMockPath, "utf8")) as {
			data: { articles: unknown[] };
		};
		const raw = root.data.articles[0];
		if (raw == null || typeof raw !== "object") {
			throw new Error("mock article missing");
		}
		const withPreview = { ...raw, preview: previewFixture };
		const entity = parseArticleEntity(withPreview);
		const summary = mapArticleToSummary("http://localhost:1337", entity);
		expect(summary.slug).toBe("article-1-test");
		expect(summary.title).toBe("Article 1 Test");
		expect(summary.subTitle).toBe("Article 1 sub-title");
		expect(summary.heroImageUrl).toBe(
			"http://localhost:1337/uploads/preview_abc.jpg",
		);
		expect(summary.heroImageAlt).toBe("Preview alt");
		expect(summary.tags).toHaveLength(1);
		expect(summary.authors).toHaveLength(1);
		expect(summary.authors[0]?.name).toBe("Dmitrii Suroviagin");
		expect(summary.metaData.metaTitle).toBeTruthy();
		expect(summary.metaData.metaDescription).toBeTruthy();
	});
});

describe("mapArticleToDetail", () => {
	it("includes rendered body HTML", () => {
		const root = JSON.parse(fs.readFileSync(articlesMockPath, "utf8")) as {
			data: { articles: unknown[] };
		};
		const raw = root.data.articles[0];
		if (raw == null || typeof raw !== "object") {
			throw new Error("mock article missing");
		}
		const withPreview = { ...raw, preview: previewFixture };
		const entity = parseArticleEntity(withPreview);
		const detail = mapArticleToDetail("http://localhost:1337", entity);
		expect(detail.bodyHtml).toContain("Lorem Ipsum");
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
	it("maps singleton with hero picture component (legacy REST)", () => {
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

	it("maps GraphQL home shape (title + subTitle, no heading)", () => {
		const raw = {
			documentId: "h1",
			title: "Chop Logic Home",
			subTitle: "A place where logic works!",
			slug: "home",
			metaData: { metaTitle: "MT", metaDescription: "MD" },
			content: [],
		};
		const entity = parseSingletonEntity(raw);
		const page = mapSingletonToPage("http://localhost:1337", entity);
		expect(page.heading).toBe("Chop Logic Home");
		expect(page.subHeading).toBe("A place where logic works!");
		expect(page.heroImageUrl).toBeNull();
	});
});
