/** biome-ignore-all lint/complexity/useLiteralKeys: Access to unknown keys */
import { ArticleNotFoundError } from "../content/errors";
import { mapDynamicContentPage, mapSiteConfig } from "../content/mappers";
import { isRecord } from "../content/mappers/checkers";
import type {
	ArticleDetail,
	ArticleSummary,
	DynamicContentPage,
	SiteConfig,
} from "../content/models";
import type {
	AboutPageContent,
	BlogIndexContent,
	ContentPort,
	HomeIndexContent,
} from "../content/ports";
import type { StrapiGraphqlClientConfig } from "./graphql/client";
import { strapiGraphqlRequest } from "./graphql/client";
import { normalizeDynamicZoneFromGraphql } from "./graphql/normalize";
import { mapArticleToDetail, mapArticleToSummary } from "./mappers";
import { ABOUT_AND_CONFIG_QUERY } from "./queries/about-and-config";
import { ARTICLE_BY_SLUG_QUERY, ARTICLES_LIST_QUERY } from "./queries/articles";
import { ARTICLES_AND_CONFIG_QUERY } from "./queries/articles-and-config";
import { CONFIG_QUERY } from "./queries/config";
import { HOME_AND_CONFIG_QUERY } from "./queries/home-and-config";
import {
	parseArticleEntity,
	parseConfigEntity,
	parseSingletonEntity,
	strapiArticleEntitySchema,
} from "./schemas";

function normalizeArticleFromGraphql(raw: unknown): unknown {
	if (!isRecord(raw)) {
		return raw;
	}
	const next: Record<string, unknown> = { ...raw };
	if (next["content"] !== undefined) {
		next["content"] = normalizeDynamicZoneFromGraphql(next["content"]);
	}
	return next;
}

export class StrapiGraphqlContentProvider implements ContentPort {
	constructor(private readonly config: StrapiGraphqlClientConfig) {}

	private mapDynamicContentPageFromGraphQL(
		document: unknown,
	): DynamicContentPage {
		if (document == null || !isRecord(document)) {
			throw new Error(
				"Page is missing, unpublished, or not returned by the CMS. Publish the single type in Strapi or check STRAPI_URL and API permissions.",
			);
		}
		const entity = parseSingletonEntity(document);
		return mapDynamicContentPage(entity, this.config.baseUrl);
	}

	private mapSiteConfigFromGraphql(config: unknown): SiteConfig {
		if (config == null || !isRecord(config)) {
			throw new Error(
				"Global config is missing, unpublished, or not returned by the CMS. Publish the Config single type in Strapi or check STRAPI_URL and API permissions.",
			);
		}
		const entity = parseConfigEntity(config);
		return mapSiteConfig(entity, this.config.baseUrl);
	}

	private mapArticleListResponse(data: {
		articles: unknown[];
	}): ArticleSummary[] {
		const rows = Array.isArray(data.articles) ? data.articles : [];
		const out: ArticleSummary[] = [];
		for (const raw of rows) {
			const normalized = normalizeArticleFromGraphql(raw);
			const parsed = strapiArticleEntitySchema.safeParse(normalized);
			if (parsed.success) {
				out.push(mapArticleToSummary(this.config.baseUrl, parsed.data));
			}
		}
		return out;
	}

	async listArticles(): Promise<ArticleSummary[]> {
		const data = await strapiGraphqlRequest<{ articles: unknown[] }>(
			this.config,
			ARTICLES_LIST_QUERY,
		);
		return this.mapArticleListResponse(data);
	}

	async getBlogPageContent(): Promise<BlogIndexContent> {
		const data = await strapiGraphqlRequest<{
			articles: unknown[];
			config: unknown;
		}>(this.config, ARTICLES_AND_CONFIG_QUERY);
		const siteConfig = this.mapSiteConfigFromGraphql(data.config);
		return {
			articles: this.mapArticleListResponse(data),
			siteConfig,
		};
	}

	async getAboutPageContent(): Promise<AboutPageContent> {
		const data = await strapiGraphqlRequest<{
			aboutMe: unknown;
			config: unknown;
		}>(this.config, ABOUT_AND_CONFIG_QUERY);
		const siteConfig = this.mapSiteConfigFromGraphql(data.config);
		return {
			page: this.mapDynamicContentPageFromGraphQL(data.aboutMe),
			siteConfig,
		};
	}

	async getArticleBySlug(slug: string): Promise<ArticleDetail> {
		const data = await strapiGraphqlRequest<{ articles: unknown[] }>(
			this.config,
			ARTICLE_BY_SLUG_QUERY,
			{ slug },
		);
		const rows = Array.isArray(data.articles) ? data.articles : [];
		const first = rows[0];
		if (first === undefined) {
			throw new ArticleNotFoundError(slug);
		}
		const normalized = normalizeArticleFromGraphql(first);
		const entity = parseArticleEntity(normalized);
		return mapArticleToDetail(this.config.baseUrl, entity);
	}

	async getHomePageContent(): Promise<HomeIndexContent> {
		const data = await strapiGraphqlRequest<{
			home: unknown;
			config: unknown;
		}>(this.config, HOME_AND_CONFIG_QUERY);
		const siteConfig = this.mapSiteConfigFromGraphql(data.config);
		return {
			home: this.mapDynamicContentPageFromGraphQL(data.home),
			siteConfig,
		};
	}

	async getSiteConfig(): Promise<SiteConfig> {
		const data = await strapiGraphqlRequest<{ config: unknown }>(
			this.config,
			CONFIG_QUERY,
		);
		return this.mapSiteConfigFromGraphql(data.config);
	}
}
