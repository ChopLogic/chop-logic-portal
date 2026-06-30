import { ArticleNotFoundError } from "../content/errors";
import { mapDynamicContentPage, mapSiteConfig } from "../content/mappers";
import { mapArticlePage, mapArticleSummary } from "../content/mappers/article";
import { isRecord } from "../content/mappers/checkers";
import type {
	ArticlePage,
	ArticleSummary,
	DynamicContentPage,
	SiteConfig,
} from "../content/models";
import type {
	AboutPageContent,
	ArticlePageContent,
	BlogPageContent,
	ContentPort,
	HomeIndexContent,
} from "../content/ports";
import type { StrapiGraphqlClientConfig } from "./graphql/client";
import { strapiGraphqlRequest } from "./graphql/client";
import {
	ABOUT_ME_PAGE_QUERY,
	ARTICLE_PAGE_BY_SLUG_QUERY,
	BLOG_PAGE_QUERY,
	HOME_PAGE_QUERY,
} from "./graphql/queries";
import { CONFIG_QUERY } from "./graphql/queries/config";
import {
	parseArticleEntity,
	parseArticleSummaryEntity,
	parseConfigEntity,
	parseSingletonEntity,
} from "./schemas";

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
		return mapDynamicContentPage(
			parseSingletonEntity(document),
			this.config.baseUrl,
		);
	}

	private mapArticlePageFromGraphQL(document: unknown): ArticlePage {
		if (document == null || !isRecord(document)) {
			throw new Error(
				"Article is missing, unpublished, or not returned by the CMS. Publish the article in Strapi or check STRAPI_URL and API permissions.",
			);
		}
		return mapArticlePage(parseArticleEntity(document), this.config.baseUrl);
	}

	private mapSiteConfigFromGraphql(config: unknown): SiteConfig {
		if (config == null || !isRecord(config)) {
			throw new Error(
				"Global config is missing, unpublished, or not returned by the CMS. Publish the Config single type in Strapi or check STRAPI_URL and API permissions.",
			);
		}
		return mapSiteConfig(parseConfigEntity(config), this.config.baseUrl);
	}

	private mapArticleSummariesListResponse(
		summaries: unknown[],
	): ArticleSummary[] {
		return summaries.map((summary) =>
			mapArticleSummary(
				parseArticleSummaryEntity(summary),
				this.config.baseUrl,
			),
		);
	}

	async getSiteConfig(): Promise<SiteConfig> {
		const data = await strapiGraphqlRequest<{ config: unknown }>(
			this.config,
			CONFIG_QUERY,
		);
		return this.mapSiteConfigFromGraphql(data.config);
	}

	async getHomePageContent(): Promise<HomeIndexContent> {
		const data = await strapiGraphqlRequest<{
			home: unknown;
			config: unknown;
		}>(this.config, HOME_PAGE_QUERY);
		return {
			home: this.mapDynamicContentPageFromGraphQL(data.home),
			siteConfig: this.mapSiteConfigFromGraphql(data.config),
		};
	}

	async getBlogPageContent(): Promise<BlogPageContent> {
		const data = await strapiGraphqlRequest<{
			articles: unknown[];
			blog: unknown;
			config: unknown;
		}>(this.config, BLOG_PAGE_QUERY);

		return {
			articles: this.mapArticleSummariesListResponse(data.articles),
			page: this.mapDynamicContentPageFromGraphQL(data.blog),
			siteConfig: this.mapSiteConfigFromGraphql(data.config),
		};
	}

	async getAboutPageContent(): Promise<AboutPageContent> {
		const data = await strapiGraphqlRequest<{
			aboutMe: unknown;
			config: unknown;
		}>(this.config, ABOUT_ME_PAGE_QUERY);
		return {
			page: this.mapDynamicContentPageFromGraphQL(data.aboutMe),
			siteConfig: this.mapSiteConfigFromGraphql(data.config),
		};
	}

	async getArticlePageBySlug(slug: string): Promise<ArticlePageContent> {
		const data = await strapiGraphqlRequest<{
			articles: unknown[];
			config: unknown;
		}>(this.config, ARTICLE_PAGE_BY_SLUG_QUERY, { slug });
		const rows = Array.isArray(data.articles) ? data.articles : [];
		const article = rows[0];
		if (article === undefined) {
			throw new ArticleNotFoundError(slug);
		}

		return {
			siteConfig: this.mapSiteConfigFromGraphql(data.config),
			page: this.mapArticlePageFromGraphQL(article),
		};
	}
}
