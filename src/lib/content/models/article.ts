import type { CmsImage } from "./image";
import type { MetaData } from "./meta-data";

export interface ArticleTag {
	documentId: string;
	name: string;
	slug: string;
	description: string | null;
}

export interface ArticleAuthor {
	documentId: string;
	name: string;
	email: string;
}

/** Article list and detail shapes for the portal (CMS-agnostic). */

export type ArticleSummary = {
	documentId: string;
	slug: string;
	title: string;
	subTitle: string | null;
	description: string;
	pubDate: Date;
	updatedDate?: Date;
	/** Absolute URL for the default preview image, or null. */
	heroImageUrl: string | null;
	heroImageAlt: string;
	/** Full image payload when the CMS provides formats (optional). */
	previewImage: CmsImage | null;
	tags: ArticleTag[];
	authors: ArticleAuthor[];
	metaData: MetaData;
};

export type ArticleDetail = ArticleSummary & {
	bodyHtml: string;
};
