import { isRecord } from "../../checks";
import type { SiteConfig } from "../models";
import { cmsImageDefaultSrc, mapCmsImage } from "./image";
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
	_baseUrl: string,
): SiteConfig {
	const siteTitle = entity.siteTitle ?? entity.title ?? "";
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

	const logoRaw = entity.logo;
	const logo =
		logoRaw != null && isRecord(logoRaw) ? mapCmsImage(logoRaw) : null;

	return {
		siteTitle,
		description,
		footerHtml,
		links: mapLinks(entity.links),
		logo,
	};
}

/** Absolute URL for site logo (for `<Image src={...} />`). */
export function siteConfigLogoSrc(
	config: SiteConfig,
	baseUrl: string,
): string | null {
	if (!config.logo) {
		return null;
	}
	return cmsImageDefaultSrc(config.logo, baseUrl);
}
