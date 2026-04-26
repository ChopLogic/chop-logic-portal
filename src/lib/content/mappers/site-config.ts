import { DEFAULT_SITE_TITLE } from "../../../constants/defaults";
import type { SiteConfig } from "../models";
import {
	type RichTextContent,
	RichTextContentType,
} from "../models/rich-text-block";
import { mapCmsImage } from "./image";
import { mapLinks } from "./link";
import { mapUnknownToRichTextBlock } from "./rich-text-block";

function footerFromPlainText(text: string): RichTextContent {
	return [
		{
			type: RichTextContentType.Paragraph,
			children: [{ type: RichTextContentType.Text, text }],
		},
	];
}

/**
 * Maps a Strapi Config document (GraphQL or REST-normalized) to the portal model.
 */
export function mapSiteConfig(
	entity: {
		siteTitle?: string;
		title?: string;
		description?: string;
		footerText?: string;
		footer?: unknown;
		links: unknown[];
		logo?: unknown;
	},
	baseUrl: string,
): SiteConfig {
	const siteTitle = entity.siteTitle ?? DEFAULT_SITE_TITLE;
	const description =
		typeof entity.description === "string" ? entity.description : "";

	let footer: RichTextContent = [];
	if (Array.isArray(entity.footer)) {
		footer = mapUnknownToRichTextBlock(entity.footer) ?? [];
	} else if (
		typeof entity.footerText === "string" &&
		entity.footerText !== ""
	) {
		footer = footerFromPlainText(entity.footerText);
	}

	return {
		siteTitle,
		description,
		footer,
		links: mapLinks(entity.links),
		logo: mapCmsImage(entity.logo, baseUrl),
	};
}
