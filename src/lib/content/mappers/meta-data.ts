/** biome-ignore-all lint/complexity/useLiteralKeys: Access to unknown keys */
import {
	DEFAULT_OPEN_GRAPH,
	DEFAULT_ROBOTS,
	DEFAULT_SITE_DESCRIPTION,
	DEFAULT_SITE_TITLE,
	OPEN_GRAPH_FALLBACK_IMAGE,
} from "../../../constants/defaults";
import {
	type MetaData,
	OgType,
	type OpenGraph,
	type OpenGraphImageMeta,
} from "../models";
import { isRecord } from "./checkers";
import { mapCmsImage, pickOpenGraphCmsImage } from "./image";
import {
	normalizeOptionalString,
	normalizeRequiredString,
} from "./normalizers";

function normalizeOgType(raw: unknown): OgType {
	if (
		typeof raw === "string" &&
		Object.values(OgType).includes(raw as OgType)
	) {
		return raw as OgType;
	}

	return OgType.WEBSITE;
}

function normalizeOgImage(
	ogImageRaw: unknown,
	baseUrl: string,
): OpenGraphImageMeta {
	if (!isRecord(ogImageRaw)) {
		return OPEN_GRAPH_FALLBACK_IMAGE;
	}

	const img = mapCmsImage(ogImageRaw, baseUrl);
	if (img) {
		const picked = pickOpenGraphCmsImage(img, baseUrl);
		return {
			src: picked.src,
			width: picked.width,
			height: picked.height,
		};
	}

	return OPEN_GRAPH_FALLBACK_IMAGE;
}

function mapOpenGraph(raw: unknown, baseUrl: string): OpenGraph {
	if (!isRecord(raw)) {
		return DEFAULT_OPEN_GRAPH;
	}

	return {
		ogDescription: normalizeRequiredString(
			raw["ogDescription"],
			DEFAULT_SITE_DESCRIPTION,
		),
		ogTitle: normalizeRequiredString(raw["ogTitle"], DEFAULT_SITE_TITLE),
		ogType: normalizeOgType(raw["ogType"]),
		ogImage: normalizeOgImage(raw["ogImage"], baseUrl),
	};
}

export function mapMetaData(raw: unknown, baseUrl: string): MetaData {
	if (!isRecord(raw)) {
		return {
			metaTitle: DEFAULT_SITE_TITLE,
			metaDescription: DEFAULT_SITE_DESCRIPTION,
			robots: DEFAULT_ROBOTS,
			openGraph: DEFAULT_OPEN_GRAPH,
		};
	}

	return {
		canonicalURL: normalizeOptionalString(raw["canonicalURL"]),
		keywords: normalizeOptionalString(raw["keywords"]),
		metaDescription: normalizeRequiredString(
			raw["metaDescription"],
			DEFAULT_SITE_DESCRIPTION,
		),
		metaTitle: normalizeRequiredString(raw["metaTitle"], DEFAULT_SITE_TITLE),
		authorName: normalizeOptionalString(raw["authorName"]),
		robots: normalizeOptionalString(raw["robots"], DEFAULT_ROBOTS),
		structuredData: raw["structuredData"] as MetaData["structuredData"],
		openGraph: mapOpenGraph(raw["openGraph"], baseUrl),
	};
}
