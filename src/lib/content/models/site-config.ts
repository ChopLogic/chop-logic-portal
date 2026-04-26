import type { CmsImage } from "./image";
import type { Link } from "./link";
import type { RichTextBlock } from "./rich-text-block";

export interface SiteConfig {
	siteTitle: string;
	description: string;
	footer: RichTextBlock;
	links: Link[];
	logo: CmsImage | null;
}
