import type { CmsImage } from "./image";
import type { Link } from "./link";

export interface SiteConfig {
	siteTitle: string;
	description: string;
	/** Pre-rendered HTML from Strapi Blocks or legacy plain footer text. */
	footerHtml: string;
	links: Link[];
	logo: CmsImage | null;
}
