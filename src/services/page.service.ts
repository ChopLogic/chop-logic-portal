import {
	ABOUT_ME_PAGE_QUERY,
	ARTICLE_PAGE_BY_SLUG_QUERY,
	ARTICLE_SLUGS_QUERY,
	BLOG_PAGE_QUERY,
	HOME_PAGE_QUERY,
} from "@api/queries";
import type { Config } from "@api/types/generated";
import { DEFAULT_SITE_DESCRIPTION, DEFAULT_SITE_TITLE } from "@constants";
import {
	mapArticleToArticlePreview,
	mapCmsImage,
	mapDynamicZoneContent,
	mapLinks,
	mapMetaData,
	mapRichTextBlock,
	mapTags,
	normalizeOptionalString,
	normalizeRequiredDate,
	normalizeRequiredString,
} from "@mappers";
import type {
	AboutMePageResponse,
	ArticlePageResponse,
	ArticleSlugsResponse,
	BlogPageResponse,
	Client,
	CorePageData,
	DynamicContentPageData,
	DynamicPageContentResponse,
	HomePageResponse,
	PageRepository,
} from "@models";
import { NotFoundError } from "./errors";

export class PageService implements PageRepository {
	private readonly apiUrl: string;

	constructor(
		private client: Client,
		{ apiUrl }: { apiUrl: string },
	) {
		this.apiUrl = apiUrl;
	}

	private mapConfigToCorePageData(config: Config): CorePageData {
		return {
			siteTitle: normalizeRequiredString(config.title, DEFAULT_SITE_TITLE),
			description: normalizeRequiredString(
				config.description,
				DEFAULT_SITE_DESCRIPTION,
			),
			footer: mapRichTextBlock(config.footer),
			links: mapLinks(config.links),
			logo: mapCmsImage(config.logo, this.apiUrl),
		};
	}

	private mapResponseToDynamicPageData(
		content: DynamicPageContentResponse,
		config: Config,
	): DynamicContentPageData {
		return {
			id: content.documentId,
			title: normalizeRequiredString(content.title),
			subTitle: normalizeOptionalString(content.subTitle),
			slug: normalizeRequiredString(content.slug),
			updatedAt: normalizeRequiredDate(content.updatedAt),
			content: mapDynamicZoneContent(content.content, this.apiUrl),
			metaData: mapMetaData(content.metaData, this.apiUrl),
			...this.mapConfigToCorePageData(config),
		};
	}

	async getHomePage() {
		const { home, config } =
			await this.client.executeQuery<HomePageResponse>(HOME_PAGE_QUERY);

		return {
			...this.mapResponseToDynamicPageData(home, config),
		};
	}

	async getAboutMePage() {
		const { aboutMe, config } =
			await this.client.executeQuery<AboutMePageResponse>(ABOUT_ME_PAGE_QUERY);

		return {
			...this.mapResponseToDynamicPageData(aboutMe, config),
		};
	}

	async getBlogPage() {
		const { blog, config, articles } =
			await this.client.executeQuery<BlogPageResponse>(BLOG_PAGE_QUERY);

		return {
			...this.mapResponseToDynamicPageData(blog, config),
			previews: articles.map((item) =>
				mapArticleToArticlePreview(item, this.apiUrl),
			),
		};
	}

	async getArticlePageBySlug(slug: string) {
		const { articles, config } =
			await this.client.executeQuery<ArticlePageResponse>(
				ARTICLE_PAGE_BY_SLUG_QUERY,
				{ slug },
			);

		const article = articles[0];

		if (!article) {
			throw new NotFoundError("Article", slug);
		}

		return {
			...this.mapResponseToDynamicPageData(article, config),
			summary: mapRichTextBlock(article.summary),
			tags: mapTags(article.tags),
		};
	}

	async getArticleSlugs() {
		const { articles } =
			await this.client.executeQuery<ArticleSlugsResponse>(ARTICLE_SLUGS_QUERY);

		return articles.map((entry) => entry.slug);
	}
}
