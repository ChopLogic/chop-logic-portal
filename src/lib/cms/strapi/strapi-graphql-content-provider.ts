import { isRecord } from "../../checks";
import { mapSiteConfig } from "../../content/mappers";
import type {
	ArticleDetail,
	ArticleSummary,
	SingletonPage,
	SiteConfig,
} from "../../content/models";
import type { ContentPort, SingletonKey } from "../../content/ports";
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

export class StrapiGraphqlContentProvider implements ContentPort {
	constructor(private readonly config: StrapiGraphqlClientConfig) {}

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

	async getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
		const data = await strapiGraphqlRequest<{ articles: unknown[] }>(
			this.config,
			ARTICLE_BY_SLUG_QUERY,
			{ slug },
		);
		const rows = Array.isArray(data.articles) ? data.articles : [];
		const first = rows[0];
		if (first === undefined) {
			return null;
		}
		const normalized = normalizeArticleFromGraphql(first);
		const entity = parseArticleEntity(normalized);
		return mapArticleToDetail(this.config.baseUrl, entity);
	}

	async getSingleton(key: SingletonKey): Promise<SingletonPage | null> {
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

		if (document == null || !isRecord(document)) {
			return null;
		}
		const normalized = normalizeSingletonFromGraphql(document);
		const entity = parseSingletonEntity(normalized);
		return mapSingletonToPage(this.config.baseUrl, entity);
	}

	async getSiteConfig(): Promise<SiteConfig | null> {
		const data = await strapiGraphqlRequest<{ config: unknown }>(
			this.config,
			CONFIG_QUERY,
		);
		if (data.config == null || !isRecord(data.config)) {
			return null;
		}
		const entity = parseConfigEntity(data.config);
		return mapSiteConfig(entity, this.config.baseUrl);
	}
}
