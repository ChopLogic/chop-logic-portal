import type { SiteConfig } from "../models";
import { mapLinks } from "./link";

/** Maps a Strapi SiteConfig document (flattened) to the portal model. */
export function mapSiteConfig(entity: {
	siteTitle: string;
	footerText: string;
	links: unknown[];
}): SiteConfig {
	return {
		siteTitle: entity.siteTitle,
		footerText: entity.footerText,
		links: mapLinks(entity.links),
	};
}
