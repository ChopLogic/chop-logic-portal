import {
	ABOUT_ME_PAGE_QUERY,
	ARTICLE_PAGE_BY_SLUG_QUERY,
	BLOG_PAGE_QUERY,
	HOME_PAGE_QUERY,
} from "@api/queries";
import type {
	AboutMePageResponse,
	ArticlePageResponse,
	BlogPageResponse,
	Client,
	HomePageResponse,
	PageRepository,
} from "@models";

export class PageService implements PageRepository {
	constructor(private client: Client) {}

	async getHomePage(): Promise<HomePageResponse> {
		const response =
			await this.client.executeQuery<HomePageResponse>(HOME_PAGE_QUERY);
		return response;
	}

	async getAboutMePage(): Promise<AboutMePageResponse> {
		const response =
			await this.client.executeQuery<AboutMePageResponse>(ABOUT_ME_PAGE_QUERY);
		return response;
	}

	async getBlogPage(): Promise<BlogPageResponse> {
		const response =
			await this.client.executeQuery<BlogPageResponse>(BLOG_PAGE_QUERY);
		return response;
	}

	async getArticlePageBySlug(slug: string): Promise<ArticlePageResponse> {
		const response = await this.client.executeQuery<ArticlePageResponse>(
			ARTICLE_PAGE_BY_SLUG_QUERY,
			{ slug },
		);
		return response;
	}
}
