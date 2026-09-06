import type {
	AboutMe,
	Article,
	Blog,
	Config,
	Home,
	PrivacyPolicy,
} from "@api/types/generated";
import type {
	ArticlePageData,
	BlogPageData,
	DynamicContentPageData,
} from "@models";

export type HomePageResponse = { home: Home; config: Config };

export type AboutMePageResponse = { aboutMe: AboutMe; config: Config };

export type PrivacyPolicyPageResponse = {
	privacyPolicy: PrivacyPolicy;
	config: Config;
};

export type BlogPageResponse = {
	blog: Blog;
	articles: Article[];
	config: Config;
};

export type ArticlePageResponse = { articles: Article[]; config: Config };

export type ArticleSlugsResponse = {
	articles: Array<{ slug: string; documentId: string }>;
};

export type DynamicPageContentResponse =
	| Home
	| AboutMe
	| Blog
	| Article
	| PrivacyPolicy;

export interface PageRepository {
	getHomePage(): Promise<DynamicContentPageData>;
	getAboutMePage(): Promise<DynamicContentPageData>;
	getPrivacyPolicyPage(): Promise<DynamicContentPageData>;
	getBlogPage(): Promise<BlogPageData>;
	getArticlePageBySlug(slug: string): Promise<ArticlePageData>;
	getArticleSlugs(): Promise<string[]>;
}
