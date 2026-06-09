import type {
	ArticleDetail,
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

export type ContentPort = {
	listArticles(): Promise<ArticleSummary[]>;
	getArticleBySlug(
		slug: string,
		siteTitleHint?: string,
	): Promise<ArticleDetail>;
	getAboutPageContent(): Promise<AboutPageContent>;
	getBlogPageContent(): Promise<BlogPageContent>;
	getHomePageContent(): Promise<HomeIndexContent>;
	getSiteConfig(): Promise<SiteConfig>;
};
