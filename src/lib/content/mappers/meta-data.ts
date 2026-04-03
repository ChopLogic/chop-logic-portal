/** biome-ignore-all lint/complexity/useLiteralKeys: Access to unknown keys */
import {
	DEFAULT_OPEN_GRAPH,
	DEFAULT_SITE_DESCRIPTION,
	DEFAULT_SITE_TITLE,
} from "../../../constants/defaults";
import { isRecord } from "../../checks";
import { type MetaData, OgType, type OpenGraph, Robots } from "../models";
import { cmsImageDefaultSrc, mapCmsImage } from "./image";

export function mapMetaData(raw: unknown, baseUrl: string): MetaData {
	if (!isRecord(raw)) {
		return {
			metaTitle: DEFAULT_SITE_TITLE,
			metaDescription: DEFAULT_SITE_DESCRIPTION,
			openGraph: DEFAULT_OPEN_GRAPH,
		};
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

	return {
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
			typeof raw["robots"] === "string"
				? (raw["robots"] as Robots)
				: Robots.INDEX,
		structuredData,
		openGraph:
			typeof raw["openGraph"] === "object" && raw["openGraph"] !== null
				? mapOpenGraph(raw["openGraph"], baseUrl)
				: undefined,
	};
}

function mapOpenGraph(raw: unknown, baseUrl: string): OpenGraph {
	if (!isRecord(raw)) {
		return DEFAULT_OPEN_GRAPH;
	}
	const ogImageRaw = raw["ogImage"];
	let ogImage: OpenGraph["ogImage"];
	if (ogImageRaw != null && isRecord(ogImageRaw)) {
		const img = mapCmsImage(ogImageRaw);
		if (img) {
			ogImage = {
				src: cmsImageDefaultSrc(img, baseUrl),
				width: img.width,
				height: img.height,
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
