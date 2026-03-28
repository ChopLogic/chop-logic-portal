import type { SiteConfig } from "./models";
import type { ArticleDetail, ArticleSummary, SingletonPage } from "./types";

export type SingletonKey = "home" | "about-me";

/** Content boundary: pages depend on this, not on a specific CMS. */
export type ContentPort = {
	listArticles(): Promise<ArticleSummary[]>;
	getArticleBySlug(slug: string): Promise<ArticleDetail | null>;
	getSingleton(key: SingletonKey): Promise<SingletonPage | null>;
	getSiteConfig(): Promise<SiteConfig | null>;
};
