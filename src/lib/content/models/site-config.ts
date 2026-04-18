import type { CmsImage } from "./image";
import type { Link } from "./link";

export interface SiteConfig {
	siteTitle: string;
	description: string;
	footerHtml: string;
	links: Link[];
	logo: CmsImage | null;
}
