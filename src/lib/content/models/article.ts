/** Article list and detail shapes for the portal (CMS-agnostic). */

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
