import type { DynamicZoneContent } from "./dynamic-zone";
import type { CmsImage } from "./image";
import type { MetaData } from "./meta-data";
import type { RichTextContent } from "./rich-text-block";
import type { Tag } from "./tag";

export interface ArticleAuthorConnection {
	readonly id: string;
	readonly name: string;
	readonly email: string;
}

export interface ArticleSummary {
	readonly id: string;
	readonly title: string;
	readonly subTitle?: string;
	readonly slug: string;
	readonly publicationDate: Date;
	readonly excerpt: string;
	readonly updatedAt?: Date;
	readonly preview?: CmsImage;
	readonly tags: Tag[];
	readonly authors: ArticleAuthorConnection[];
}

export type ArticlePage = ArticleSummary & {
	readonly summary: RichTextContent;
	readonly content: DynamicZoneContent;
	readonly metaData: MetaData;
};
