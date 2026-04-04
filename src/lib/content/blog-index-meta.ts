import {
	DEFAULT_META_DATA,
	DEFAULT_SITE_DESCRIPTION,
	DEFAULT_SITE_TITLE,
} from "../../constants/defaults";
import type { MetaData, SiteConfig } from "./models";

/**
 * Head metadata for `/blog` (no dedicated CMS page). Uses global site config
 * for title and description.
 */
export function blogListingMetaData(siteConfig: SiteConfig): MetaData {
	const siteTitle = siteConfig.siteTitle || DEFAULT_SITE_TITLE;
	const description =
		siteConfig.description.trim() !== ""
			? siteConfig.description
			: DEFAULT_SITE_DESCRIPTION;
	return {
		...DEFAULT_META_DATA,
		metaTitle: `${siteTitle} – Blog`,
		metaDescription: description,
	};
}
