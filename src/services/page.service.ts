import {
	ABOUT_ME_PAGE_QUERY,
	ARTICLE_PAGE_BY_SLUG_QUERY,
	BLOG_PAGE_QUERY,
	HOME_PAGE_QUERY,
} from "@api/queries";
import { DEFAULT_SITE_DESCRIPTION, DEFAULT_SITE_TITLE } from "@constants";
import {
	mapArticleToArticlePreview,
	mapCmsImage,
	mapDynamicZoneContent,
	mapLinks,
	mapMetaData,
	mapRichTextBlock,
	normalizeOptionalString,
	normalizeRequiredDate,
	normalizeRequiredString,
} from "@mappers";
import type {
	AboutMePageResponse,
	ArticlePageResponse,
	BlogPageResponse,
	Client,
	HomePageResponse,
	PageRepository,
} from "@models";

export class PageService implements PageRepository {
	private readonly siteUrl: string;
	private readonly apiUrl: string;

	constructor(
		private client: Client,
		{ siteUrl, apiUrl }: { siteUrl: string; apiUrl: string },
	) {
		this.siteUrl = siteUrl;
		this.apiUrl = apiUrl;
	}

	async getHomePage() {
		const { home, config } =
			await this.client.executeQuery<HomePageResponse>(HOME_PAGE_QUERY);

		return {
			id: home.documentId,
			title: normalizeRequiredString(home.title),
			subTitle: normalizeOptionalString(home.subTitle),
			slug: normalizeRequiredString(home.slug),
			updatedAt: normalizeRequiredDate(home.updatedAt),
			content: mapDynamicZoneContent(home.content),
			metaData: mapMetaData(home.metaData, this.siteUrl),
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

	async getAboutMePage() {
		const { aboutMe, config } =
			await this.client.executeQuery<AboutMePageResponse>(ABOUT_ME_PAGE_QUERY);

		return {
			id: aboutMe.documentId,
			title: normalizeRequiredString(aboutMe.title),
			subTitle: normalizeOptionalString(aboutMe.subTitle),
			slug: normalizeRequiredString(aboutMe.slug),
			updatedAt: normalizeRequiredDate(aboutMe.updatedAt),
			content: mapDynamicZoneContent(aboutMe.content),
			metaData: mapMetaData(aboutMe.metaData, this.siteUrl),
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

	async getBlogPage() {
		const { blog, config, articles } =
			await this.client.executeQuery<BlogPageResponse>(BLOG_PAGE_QUERY);

		return {
			id: blog.documentId,
			title: normalizeRequiredString(blog.title),
			subTitle: normalizeOptionalString(blog.subTitle),
			slug: normalizeRequiredString(blog.slug),
			updatedAt: normalizeRequiredDate(blog.updatedAt),
			content: mapDynamicZoneContent(blog.content),
			metaData: mapMetaData(blog.metaData, this.siteUrl),
			siteTitle: normalizeRequiredString(config.title, DEFAULT_SITE_TITLE),
			description: normalizeRequiredString(
				config.description,
				DEFAULT_SITE_DESCRIPTION,
			),
			footer: mapRichTextBlock(config.footer),
			links: mapLinks(config.links),
			logo: mapCmsImage(config.logo, this.apiUrl),
			previews: articles.map((item) =>
				mapArticleToArticlePreview(item, this.apiUrl),
			),
		};
	}

	async getArticlePageBySlug(slug: string): Promise<ArticlePageResponse> {
		const response = await this.client.executeQuery<ArticlePageResponse>(
			ARTICLE_PAGE_BY_SLUG_QUERY,
			{ slug },
		);
		return response;
	}
}
