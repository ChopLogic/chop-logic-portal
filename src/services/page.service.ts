import { executeQuery } from "../api/client";
import {
	ABOUT_ME_PAGE_QUERY,
	ARTICLE_PAGE_BY_SLUG_QUERY,
	BLOG_PAGE_QUERY,
	HOME_PAGE_QUERY,
} from "../api/queries";
import type {
	AboutMe,
	Article,
	Blog,
	Config,
	Home,
} from "../api/types/generated";

type HomePageResponse = { home: Home; config: Config };

type AboutMePageResponse = { aboutMe: AboutMe; config: Config };

type BlogPageResponse = { blog: Blog; articles: Article[]; config: Config };

type ArticlePageResponse = { articles: Article[]; config: Config };

export class PageService {
	async getHomePage(): Promise<HomePageResponse> {
		const response = await executeQuery<HomePageResponse>(HOME_PAGE_QUERY);
		return response;
	}

	async getAboutMePage(): Promise<AboutMePageResponse> {
		const response =
			await executeQuery<AboutMePageResponse>(ABOUT_ME_PAGE_QUERY);
		return response;
	}

	async getBlogPage(): Promise<BlogPageResponse> {
		const response = await executeQuery<BlogPageResponse>(BLOG_PAGE_QUERY);
		return response;
	}

	async getArticlePageBySlug(slug: string): Promise<ArticlePageResponse> {
		const response = await executeQuery<ArticlePageResponse>(
			ARTICLE_PAGE_BY_SLUG_QUERY,
			{ slug },
		);
		return response;
	}
}
