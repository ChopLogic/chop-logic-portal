import type {
	ArticleDetail,
	ArticleSummary,
	HomePage,
	SingletonPage,
	SiteConfig,
} from "./models";

export type SingletonKey = "home" | "about-me";

export type HomeIndexContent = {
	home: HomePage;
	siteConfig: SiteConfig;
};

export type BlogIndexContent = {
	articles: ArticleSummary[];
	siteConfig: SiteConfig;
};

export type AboutPageContent = {
	page: SingletonPage;
	siteConfig: SiteConfig;
};

export type ContentPort = {
	listArticles(): Promise<ArticleSummary[]>;
	getArticleBySlug(
		slug: string,
		siteTitleHint?: string,
	): Promise<ArticleDetail>;
	getAboutPageContent(): Promise<AboutPageContent>;
	getBlogIndexContent(): Promise<BlogIndexContent>;
	getHomeIndexContent(): Promise<HomeIndexContent>;
	getSingleton(key: SingletonKey): Promise<HomePage | SingletonPage>;
	getSiteConfig(): Promise<SiteConfig>;
};
