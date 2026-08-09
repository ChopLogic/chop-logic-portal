import type { DynamicZoneContent } from "./dynamic-zone";
import type { Link } from "./link";
import type { MetaData } from "./meta-data";
import type { RichTextContent } from "./rich-text-block";

export interface CorePageData {
	siteTitle: string;
	footer: RichTextContent;
	links: Link[];
	metaData: MetaData;
}

export interface DynamicContentPageData extends CorePageData {
	readonly id: string;
	readonly title: string;
	readonly subTitle?: string;
	readonly slug: string;
	readonly updatedAt: Date;
	readonly content: DynamicZoneContent;
}
