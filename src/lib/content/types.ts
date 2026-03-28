/** Domain models for the portal UI (CMS-agnostic). */

export type ArticleSummary = {
	documentId: string;
	slug: string;
	title: string;
	description: string;
	pubDate: Date;
	updatedDate?: Date;
	heroImageUrl: string | null;
	heroImageAlt: string;
};

export type ArticleDetail = ArticleSummary & {
	bodyHtml: string;
};

export type SingletonPage = {
	documentId: string;
	slug: string;
	title: string;
	heading: string;
	subHeading: string | null;
	seo: {
		metaTitle: string;
		metaDescription: string;
	};
	heroImageUrl: string | null;
	heroImageAlt: string;
	bodyHtml: string;
	/** Strapi `publishedAt`, when present. */
	publishedAt: Date | null;
};
