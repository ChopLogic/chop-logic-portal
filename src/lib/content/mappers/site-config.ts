import {
	DEFAULT_SITE_DESCRIPTION,
	DEFAULT_SITE_TITLE,
} from "../../../constants/defaults";
import type { SiteConfig } from "../models";
import { normalizeRequiredString } from "./helpers";
import { mapCmsImage } from "./image";
import { mapLinks } from "./link";
import { mapRichTextBlock } from "./rich-text-block";

export function mapSiteConfig(
	entity: {
		siteTitle?: string;
		title?: string;
		description?: string;
		footer?: unknown;
		links: unknown[];
		logo?: unknown;
	},
	baseUrl: string,
): SiteConfig {
	return {
		siteTitle: normalizeRequiredString(entity.siteTitle, DEFAULT_SITE_TITLE),
		description: normalizeRequiredString(
			entity.description,
			DEFAULT_SITE_DESCRIPTION,
		),
		footer: mapRichTextBlock(entity.footer),
		links: mapLinks(entity.links),
		logo: mapCmsImage(entity.logo, baseUrl),
	};
}
