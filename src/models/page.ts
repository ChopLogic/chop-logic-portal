import type { ArticlePreview, CmsImage } from "@models";
import type { DynamicZoneContent } from "./dynamic-zone";
import type { Link } from "./link";
import type { MetaData } from "./meta-data";
import type { RichTextContent } from "./rich-text-block";

export interface CorePageData {
	readonly siteTitle: string;
	readonly description?: string;
	readonly footer: RichTextContent;
	readonly links: Link[];
	readonly logo: CmsImage | null;
}

export interface DynamicContentPageData extends CorePageData {
	readonly id: string;
	readonly title: string;
	readonly subTitle?: string;
	readonly slug: string;
	readonly updatedAt: Date;
	readonly content: DynamicZoneContent;
	readonly metaData: MetaData;
}

export interface BlogPageData extends DynamicContentPageData {
	previews: ArticlePreview[];
}

export interface ArticlePageData extends DynamicContentPageData {
	readonly summary: RichTextContent;
}
