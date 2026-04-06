/** biome-ignore-all lint/complexity/useLiteralKeys: Access to unknown keys */
import {
	DEFAULT_OPEN_GRAPH,
	DEFAULT_ROBOTS,
	DEFAULT_SITE_DESCRIPTION,
	DEFAULT_SITE_TITLE,
	OPEN_GRAPH_FALLBACK_IMAGE,
} from "../../../constants/defaults";
import { isRecord } from "../../checks";
import {
	type MetaData,
	OgType,
	type OpenGraph,
	type OpenGraphImageMeta,
	type PageMetaData,
} from "../models";
import { mapCmsImage, pickOpenGraphCmsImage } from "./image";

function mapOpenGraph(raw: unknown, baseUrl: string): OpenGraph {
	if (!isRecord(raw)) {
		return DEFAULT_OPEN_GRAPH;
	}
	const ogImageRaw = raw["ogImage"];
	let ogImage: OpenGraph["ogImage"];
	if (ogImageRaw != null && isRecord(ogImageRaw)) {
		const img = mapCmsImage(ogImageRaw);
		if (img) {
			const alt =
				typeof img.alternativeText === "string" &&
				img.alternativeText.trim() !== ""
					? img.alternativeText.trim()
					: img.name.trim() !== ""
						? img.name
						: undefined;
			const picked = pickOpenGraphCmsImage(img, baseUrl);
			ogImage = {
				src: picked.src,
				width: picked.width,
				height: picked.height,
				alt,
			};
		}
	}
	return {
		ogDescription:
			typeof raw["ogDescription"] === "string"
				? raw["ogDescription"]
				: DEFAULT_SITE_DESCRIPTION,
		ogTitle:
			typeof raw["ogTitle"] === "string" ? raw["ogTitle"] : DEFAULT_SITE_TITLE,
		ogType:
			typeof raw["ogType"] === "string"
				? (raw["ogType"] as OpenGraph["ogType"])
				: OgType.WEBSITE,
		ogImage,
	};
}

function resolveOgImageForPage(
	partial: OpenGraph | undefined,
	siteTitle: string,
): OpenGraphImageMeta & { alt: string } {
	const fromCms = partial?.ogImage;
	if (fromCms) {
		const alt =
			fromCms.alt != null && fromCms.alt.trim() !== ""
				? fromCms.alt.trim()
				: siteTitle;
		return { ...fromCms, alt };
	}
	return {
		...OPEN_GRAPH_FALLBACK_IMAGE,
		alt: siteTitle,
	};
}

/**
 * Last step for anything that becomes `<MetaData />` props: trimmed optional fields,
 * robots default, OG image + alt, merged with defaults.
 */
export function finalizePageMetaData(
	meta: MetaData,
	siteTitle: string,
): PageMetaData {
	const resolvedTitle =
		siteTitle.trim() !== "" ? siteTitle.trim() : DEFAULT_SITE_TITLE;
	const keywords =
		meta.keywords != null && meta.keywords.trim() !== ""
			? meta.keywords.trim()
			: undefined;
	const authorName =
		meta.authorName != null && meta.authorName.trim() !== ""
			? meta.authorName.trim()
			: undefined;
	const robots =
		meta.robots != null && meta.robots.trim() !== ""
			? meta.robots.trim()
			: DEFAULT_ROBOTS;
	const partial = meta.openGraph;
	const openGraph = {
		ogDescription: partial?.ogDescription ?? DEFAULT_OPEN_GRAPH.ogDescription,
		ogTitle: partial?.ogTitle ?? DEFAULT_OPEN_GRAPH.ogTitle,
		ogType: partial?.ogType ?? DEFAULT_OPEN_GRAPH.ogType,
		ogImage: resolveOgImageForPage(partial, resolvedTitle),
	};
	return {
		...meta,
		keywords,
		authorName,
		robots,
		openGraph,
	};
}

/** Maps Strapi (or similar) meta JSON; `siteTitle` drives default OG alt text. */
export function mapMetaData(
	raw: unknown,
	baseUrl: string,
	siteTitle: string,
): PageMetaData {
	if (!isRecord(raw)) {
		return finalizePageMetaData(
			{
				metaTitle: DEFAULT_SITE_TITLE,
				metaDescription: DEFAULT_SITE_DESCRIPTION,
				robots: DEFAULT_ROBOTS,
				openGraph: DEFAULT_OPEN_GRAPH,
			},
			siteTitle,
		);
	}

	const structuredRaw = raw["structuredData"];
	let structuredData: MetaData["structuredData"];
	if (structuredRaw === null || structuredRaw === undefined) {
		structuredData = undefined;
	} else if (
		typeof structuredRaw === "string" ||
		typeof structuredRaw === "number" ||
		typeof structuredRaw === "boolean"
	) {
		structuredData = structuredRaw;
	} else if (Array.isArray(structuredRaw)) {
		structuredData = structuredRaw as MetaData["structuredData"];
	} else if (typeof structuredRaw === "object") {
		structuredData = structuredRaw as MetaData["structuredData"];
	} else {
		structuredData = undefined;
	}

	const draft: MetaData = {
		canonicalURL:
			typeof raw["canonicalURL"] === "string" ? raw["canonicalURL"] : undefined,
		keywords: typeof raw["keywords"] === "string" ? raw["keywords"] : undefined,
		metaDescription:
			typeof raw["metaDescription"] === "string"
				? raw["metaDescription"]
				: DEFAULT_SITE_DESCRIPTION,
		metaTitle:
			typeof raw["metaTitle"] === "string"
				? raw["metaTitle"]
				: DEFAULT_SITE_TITLE,
		authorName:
			typeof raw["authorName"] === "string" ? raw["authorName"] : undefined,
		robots:
			typeof raw["robots"] === "string" && raw["robots"].trim() !== ""
				? raw["robots"].trim()
				: DEFAULT_ROBOTS,
		structuredData,
		openGraph:
			typeof raw["openGraph"] === "object" && raw["openGraph"] !== null
				? mapOpenGraph(raw["openGraph"], baseUrl)
				: undefined,
	};

	return finalizePageMetaData(draft, siteTitle);
}
