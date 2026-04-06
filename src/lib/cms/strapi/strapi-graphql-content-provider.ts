import { DEFAULT_SITE_TITLE } from "../../../constants/defaults";
import { isRecord } from "../../checks";
import { ArticleNotFoundError } from "../../content/errors";
import { mapSiteConfig } from "../../content/mappers";
import type {
	ArticleDetail,
	ArticleSummary,
	SingletonPage,
	SiteConfig,
} from "../../content/models";
import type {
	AboutPageContent,
	BlogIndexContent,
	ContentPort,
	HomeIndexContent,
	SingletonKey,
} from "../../content/ports";
import type { StrapiGraphqlClientConfig } from "./graphql/client";
import { strapiGraphqlRequest } from "./graphql/client";
import { normalizeDynamicZoneFromGraphql } from "./graphql/normalize";
import {
	mapArticleToDetail,
	mapArticleToSummary,
	mapSingletonToPage,
} from "./mappers";
import { ABOUT_AND_CONFIG_QUERY } from "./queries/about-and-config";
import { ABOUT_ME_QUERY } from "./queries/about-me";
import { ARTICLE_BY_SLUG_QUERY, ARTICLES_LIST_QUERY } from "./queries/articles";
import { ARTICLES_AND_CONFIG_QUERY } from "./queries/articles-and-config";
import { CONFIG_QUERY } from "./queries/config";
import { HOME_AND_CONFIG_QUERY } from "./queries/home-and-config";
import { HOME_PAGE_QUERY } from "./queries/home-page";
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

function normalizeSingletonFromGraphql(raw: unknown): unknown {
	if (!isRecord(raw)) {
		return raw;
	}
	const next: Record<string, unknown> = { ...raw };
	if (next["content"] !== undefined) {
		next["content"] = normalizeDynamicZoneFromGraphql(next["content"]);
	}
	return next;
}

function singletonLabel(key: SingletonKey): string {
	return key === "home" ? "Home" : "About Me";
}

function siteTitleFromConfig(config: SiteConfig): string {
	const t = config.siteTitle.trim();
	return t !== "" ? t : DEFAULT_SITE_TITLE;
}

export class StrapiGraphqlContentProvider implements ContentPort {
	constructor(private readonly config: StrapiGraphqlClientConfig) {}

	private mapSingletonFromGraphql(
		document: unknown,
		cmsLabel: string,
		siteTitle: string,
	): SingletonPage {
		if (document == null || !isRecord(document)) {
			throw new Error(
				`${cmsLabel} is missing, unpublished, or not returned by the CMS. Publish the single type in Strapi or check STRAPI_URL and API permissions.`,
			);
		}
		const normalized = normalizeSingletonFromGraphql(document);
		const entity = parseSingletonEntity(normalized);
		return mapSingletonToPage(this.config.baseUrl, entity, siteTitle);
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

	private mapArticleListResponse(
		data: { articles: unknown[] },
		siteTitle: string,
	): ArticleSummary[] {
		const rows = Array.isArray(data.articles) ? data.articles : [];
		const out: ArticleSummary[] = [];
		for (const raw of rows) {
			const normalized = normalizeArticleFromGraphql(raw);
			const parsed = strapiArticleEntitySchema.safeParse(normalized);
			if (parsed.success) {
				out.push(
					mapArticleToSummary(this.config.baseUrl, parsed.data, siteTitle),
				);
			}
		}
		return out;
	}

	async listArticles(): Promise<ArticleSummary[]> {
		const data = await strapiGraphqlRequest<{ articles: unknown[] }>(
			this.config,
			ARTICLES_LIST_QUERY,
		);
		return this.mapArticleListResponse(data, DEFAULT_SITE_TITLE);
	}

	async getBlogIndexContent(): Promise<BlogIndexContent> {
		const data = await strapiGraphqlRequest<{
			articles: unknown[];
			config: unknown;
		}>(this.config, ARTICLES_AND_CONFIG_QUERY);
		const siteConfig = this.mapSiteConfigFromGraphql(data.config);
		return {
			articles: this.mapArticleListResponse(
				data,
				siteTitleFromConfig(siteConfig),
			),
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
			page: this.mapSingletonFromGraphql(
				data.aboutMe,
				"About Me",
				siteTitleFromConfig(siteConfig),
			),
			siteConfig,
		};
	}

	async getArticleBySlug(
		slug: string,
		siteTitleHint?: string,
	): Promise<ArticleDetail> {
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
		const siteTitle = siteTitleHint?.trim() || DEFAULT_SITE_TITLE;
		return mapArticleToDetail(this.config.baseUrl, entity, siteTitle);
	}

	async getHomeIndexContent(): Promise<HomeIndexContent> {
		const data = await strapiGraphqlRequest<{
			home: unknown;
			config: unknown;
		}>(this.config, HOME_AND_CONFIG_QUERY);
		const siteConfig = this.mapSiteConfigFromGraphql(data.config);
		return {
			home: this.mapSingletonFromGraphql(
				data.home,
				"Home",
				siteTitleFromConfig(siteConfig),
			),
			siteConfig,
		};
	}

	async getSingleton(key: SingletonKey): Promise<SingletonPage> {
		const document =
			key === "home"
				? (
						await strapiGraphqlRequest<{ home: unknown }>(
							this.config,
							HOME_PAGE_QUERY,
						)
					).home
				: (
						await strapiGraphqlRequest<{ aboutMe: unknown }>(
							this.config,
							ABOUT_ME_QUERY,
						)
					).aboutMe;

		return this.mapSingletonFromGraphql(
			document,
			singletonLabel(key),
			DEFAULT_SITE_TITLE,
		);
	}

	async getSiteConfig(): Promise<SiteConfig> {
		const data = await strapiGraphqlRequest<{ config: unknown }>(
			this.config,
			CONFIG_QUERY,
		);
		return this.mapSiteConfigFromGraphql(data.config);
	}
}
