import type {
	AboutMe,
	Article,
	Blog,
	Config,
	Home,
} from "@api/types/generated";
import type { BlogPageData, DynamicContentPageData } from "@models";

export type HomePageResponse = { home: Home; config: Config };

export type AboutMePageResponse = { aboutMe: AboutMe; config: Config };

export type BlogPageResponse = {
	blog: Blog;
	articles: Article[];
	config: Config;
};

export type ArticlePageResponse = { articles: Article[]; config: Config };

export interface PageRepository {
	getHomePage(): Promise<DynamicContentPageData>;
	getAboutMePage(): Promise<DynamicContentPageData>;
	getBlogPage(): Promise<BlogPageData>;
	getArticlePageBySlug(slug: string): Promise<ArticlePageResponse>;
}
