import { mapLinks } from "../../content/mappers";
import type { SiteConfig } from "../../content/models";
import type { ContentPort, SingletonKey } from "../../content/ports";
import type { ArticleDetail, ArticleSummary } from "../../content/types";
import { type StrapiClientConfig, strapiFetch } from "./client";
import {
	mapArticleToDetail,
	mapArticleToSummary,
	mapSingletonToPage,
} from "./mappers";
import {
	appendArticleDetailPopulate,
	appendArticleListPopulate,
	appendDynamicZonePopulate,
} from "./populate";
import {
	parseArticleEntity,
	parseConfigEntity,
	parseSingletonEntity,
	parseStrapiList,
	parseStrapiSingle,
	strapiArticleEntitySchema,
} from "./schemas";

const singletonPaths: Record<SingletonKey, string> = {
	home: "/api/home",
	"about-me": "/api/about-me",
};

export class StrapiContentProvider implements ContentPort {
	constructor(private readonly config: StrapiClientConfig) {}

	async listArticles(): Promise<ArticleSummary[]> {
		const params = new URLSearchParams();
		appendArticleListPopulate(params);
		params.set("pagination[pageSize]", "100");
		params.set("sort[0]", "publicationDate:desc");

		const res = await strapiFetch(this.config, "/api/articles", params);
		if (!res.ok) {
			throw new Error(
				`Strapi list articles failed: ${res.status} ${await res.text()}`,
			);
		}
		const json: unknown = await res.json();
		const parsed = parseStrapiList(json);
		const out: ArticleSummary[] = [];
		for (const raw of parsed.data) {
			const entity = strapiArticleEntitySchema.safeParse(raw);
			if (entity.success) {
				out.push(mapArticleToSummary(this.config.baseUrl, entity.data));
			}
		}
		return out;
	}

	async getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
		const params = new URLSearchParams();
		appendArticleDetailPopulate(params);
		params.set("filters[slug][$eq]", slug);

		const res = await strapiFetch(this.config, "/api/articles", params);
		if (!res.ok) {
			throw new Error(
				`Strapi get article failed: ${res.status} ${await res.text()}`,
			);
		}
		const json: unknown = await res.json();
		const parsed = parseStrapiList(json);
		const first = parsed.data[0];
		if (!first) {
			return null;
		}
		const entity = parseArticleEntity(first);
		return mapArticleToDetail(this.config.baseUrl, entity);
	}

	async getSingleton(key: SingletonKey) {
		const params = new URLSearchParams();
		params.set("populate[metaData]", "true");
		if (key === "about-me") {
			params.set("populate[heroImage][populate][image]", "true");
		}
		appendDynamicZonePopulate(params);

		const res = await strapiFetch(this.config, singletonPaths[key], params);
		if (!res.ok) {
			throw new Error(
				`Strapi get singleton ${key} failed: ${res.status} ${await res.text()}`,
			);
		}
		const json: unknown = await res.json();
		const parsed = parseStrapiSingle(json);
		if (!parsed.data) {
			return null;
		}
		const entity = parseSingletonEntity(parsed.data);
		return mapSingletonToPage(this.config.baseUrl, entity);
	}

	async getSiteConfig(): Promise<SiteConfig | null> {
		const params = new URLSearchParams();
		params.set("populate[links]", "true");

		const res = await strapiFetch(this.config, "/api/config", params);

		if (!res.ok) {
			throw new Error(
				`Strapi get config failed: ${res.status} ${await res.text()}`,
			);
		}

		const json: unknown = await res.json();
		const parsed = parseStrapiSingle(json);
		if (!parsed.data) {
			return null;
		}
		const entity = parseConfigEntity(parsed.data);

		return {
			siteTitle: entity.siteTitle,
			footerText: entity.footerText,
			links: mapLinks(entity.links),
		};
	}
}
