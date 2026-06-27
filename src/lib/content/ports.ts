import type {
	ArticlePage,
	ArticleSummary,
	DynamicContentPage,
	SiteConfig,
} from "./models";

export type HomeIndexContent = {
	home: DynamicContentPage;
	siteConfig: SiteConfig;
};

export type BlogPageContent = {
	page: DynamicContentPage;
	articles: ArticleSummary[];
	siteConfig: SiteConfig;
};

export type AboutPageContent = {
	page: DynamicContentPage;
	siteConfig: SiteConfig;
};

export type ArticlePageContent = {
	page: ArticlePage;
	siteConfig: SiteConfig;
};

export type ContentPort = {
	getArticlePageBySlug(slug: string): Promise<ArticlePageContent>;
	getAboutPageContent(): Promise<AboutPageContent>;
	getBlogPageContent(): Promise<BlogPageContent>;
	getHomePageContent(): Promise<HomeIndexContent>;
	getSiteConfig(): Promise<SiteConfig>;
};
