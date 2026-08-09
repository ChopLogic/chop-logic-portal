import type { Config } from "@api/types/generated";
import { DEFAULT_SITE_DESCRIPTION, DEFAULT_SITE_TITLE } from "@constants";
import type { SiteConfig } from "@models";
import { mapCmsImage } from "./image";
import { mapLinks } from "./link";
import { normalizeRequiredString } from "./normalizers";
import { mapRichTextBlock } from "./rich-text-block";

export function mapSiteConfig(entity: Config, baseUrl: string): SiteConfig {
	return {
		siteTitle: normalizeRequiredString(entity.title, DEFAULT_SITE_TITLE),
		description: normalizeRequiredString(
			entity.description,
			DEFAULT_SITE_DESCRIPTION,
		),
		footer: mapRichTextBlock(entity.footer),
		links: mapLinks(entity.links),
		logo: mapCmsImage(entity.logo, baseUrl),
	};
}
