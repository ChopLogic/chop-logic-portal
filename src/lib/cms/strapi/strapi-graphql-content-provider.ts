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
import { ABOUT_ME_QUERY } from "./queries/about-me";
import { ARTICLE_BY_SLUG_QUERY, ARTICLES_LIST_QUERY } from "./queries/articles";
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

export class StrapiGraphqlContentProvider implements ContentPort {
	constructor(private readonly config: StrapiGraphqlClientConfig) {}

	private mapSingletonFromGraphql(
		document: unknown,
		cmsLabel: string,
	): SingletonPage {
		if (document == null || !isRecord(document)) {
			throw new Error(
				`${cmsLabel} is missing, unpublished, or not returned by the CMS. Publish the single type in Strapi or check STRAPI_URL and API permissions.`,
			);
		}
		const normalized = normalizeSingletonFromGraphql(document);
		const entity = parseSingletonEntity(normalized);
		return mapSingletonToPage(this.config.baseUrl, entity);
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

	async listArticles(): Promise<ArticleSummary[]> {
		const data = await strapiGraphqlRequest<{ articles: unknown[] }>(
			this.config,
			ARTICLES_LIST_QUERY,
		);
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

	async getHomeIndexContent(): Promise<HomeIndexContent> {
		const data = await strapiGraphqlRequest<{
			home: unknown;
			config: unknown;
		}>(this.config, HOME_AND_CONFIG_QUERY);
		return {
			home: this.mapSingletonFromGraphql(data.home, "Home"),
			siteConfig: this.mapSiteConfigFromGraphql(data.config),
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

		return this.mapSingletonFromGraphql(document, singletonLabel(key));
	}

	async getSiteConfig(): Promise<SiteConfig> {
		const data = await strapiGraphqlRequest<{ config: unknown }>(
			this.config,
			CONFIG_QUERY,
		);
		return this.mapSiteConfigFromGraphql(data.config);
	}
}
