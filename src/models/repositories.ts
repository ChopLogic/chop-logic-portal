import type {
	AboutMe,
	Article,
	Blog,
	Config,
	Home,
} from "@api/types/generated";

export type HomePageResponse = { home: Home; config: Config };

export type AboutMePageResponse = { aboutMe: AboutMe; config: Config };

export type BlogPageResponse = {
	blog: Blog;
	articles: Article[];
	config: Config;
};

export type ArticlePageResponse = { articles: Article[]; config: Config };

export interface PageRepository {
	getHomePage(): Promise<HomePageResponse>;
	getAboutMePage(): Promise<AboutMePageResponse>;
	getBlogPage(): Promise<BlogPageResponse>;
	getArticlePageBySlug(slug: string): Promise<ArticlePageResponse>;
}
