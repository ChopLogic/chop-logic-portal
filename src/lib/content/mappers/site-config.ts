import { DEFAULT_SITE_TITLE } from "../../../constants/defaults";
import type { SiteConfig } from "../models";
import { mapCmsImage } from "./image";
import { mapLinks } from "./link";
import { parseRichTextDocument, richTextToHtml } from "./rich-text";

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
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

	let footerHtml = "";
	if (Array.isArray(entity.footer)) {
		const doc = parseRichTextDocument(entity.footer);
		footerHtml = doc ? richTextToHtml(doc) : "";
	} else if (
		typeof entity.footerText === "string" &&
		entity.footerText !== ""
	) {
		footerHtml = `<p>${escapeHtml(entity.footerText)}</p>`;
	}

	return {
		siteTitle,
		description,
		footerHtml,
		links: mapLinks(entity.links),
		logo: mapCmsImage(entity.logo, baseUrl),
	};
}
