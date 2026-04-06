import {
	DEFAULT_META_DATA,
	DEFAULT_SITE_DESCRIPTION,
	DEFAULT_SITE_TITLE,
} from "../../constants/defaults";
import { finalizePageMetaData } from "./mappers";
import type { PageMetaData, SiteConfig } from "./models";

/**
 * Head metadata for `/blog` (no dedicated CMS page). Uses global site config
 * for title and description.
 */
export function blogListingMetaData(siteConfig: SiteConfig): PageMetaData {
	const siteTitle = siteConfig.siteTitle || DEFAULT_SITE_TITLE;
	const description =
		siteConfig.description.trim() !== ""
			? siteConfig.description
			: DEFAULT_SITE_DESCRIPTION;
	return finalizePageMetaData(
		{
			...DEFAULT_META_DATA,
			metaTitle: `${siteTitle} – Blog`,
			metaDescription: description,
		},
		siteTitle,
	);
}
