import type {
	ArticleDetail,
	ArticleSummary,
	SingletonPage,
	SiteConfig,
} from "./models";

export type SingletonKey = "home" | "about-me";

export type HomeIndexContent = {
	home: SingletonPage;
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

/** Content boundary: pages depend on this, not on a specific CMS. */
export type ContentPort = {
	listArticles(): Promise<ArticleSummary[]>;
	getArticleBySlug(
		slug: string,
		siteTitleHint?: string,
	): Promise<ArticleDetail>;
	getAboutPageContent(): Promise<AboutPageContent>;
	/** Article list plus global config in one CMS round-trip. */
	getBlogIndexContent(): Promise<BlogIndexContent>;
	/** Home singleton plus global config in one CMS round-trip. */
	getHomeIndexContent(): Promise<HomeIndexContent>;
	getSingleton(key: SingletonKey): Promise<SingletonPage>;
	getSiteConfig(): Promise<SiteConfig>;
};
