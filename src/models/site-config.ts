import type { CmsImage } from "./image";
import type { Link } from "./link";
import type { RichTextContent } from "./rich-text-block";

export interface SiteConfig {
	siteTitle: string;
	description: string;
	footer: RichTextContent;
	links: Link[];
	logo: CmsImage | null;
}
