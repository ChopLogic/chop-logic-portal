/** biome-ignore-all lint/complexity/useLiteralKeys: Access to unknown keys */
import {
	DEFAULT_OPEN_GRAPH,
	DEFAULT_SITE_DESCRIPTION,
	DEFAULT_SITE_TITLE,
} from "../../../constants/defaults";
import { isRecord } from "../../checks";
import { type MetaData, OgType, type OpenGraph, Robots } from "../models";

export function mapMetaData(raw: unknown): MetaData {
	if (!isRecord(raw)) {
		return {
			metaTitle: DEFAULT_SITE_TITLE,
			metaDescription: DEFAULT_SITE_DESCRIPTION,
			openGraph: DEFAULT_OPEN_GRAPH,
		};
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
		structuredData:
			typeof raw["structuredData"] === "object"
				? raw["structuredData"]
				: undefined,
		openGraph:
			typeof raw["openGraph"] === "object"
				? mapOpenGraph(raw["openGraph"])
				: undefined,
	};
}

function mapOpenGraph(raw: unknown): OpenGraph {
	if (!isRecord(raw)) {
		return DEFAULT_OPEN_GRAPH;
	} else {
		return {
			ogDescription:
				typeof raw["ogDescription"] === "string"
					? raw["ogDescription"]
					: DEFAULT_SITE_DESCRIPTION,
			ogTitle:
				typeof raw["ogTitle"] === "string"
					? raw["ogTitle"]
					: DEFAULT_SITE_TITLE,
			ogType:
				typeof raw["ogType"] === "string"
					? (raw["ogType"] as OgType)
					: OgType.WEBSITE,
			ogImage:
				typeof raw["ogImage"] === "object"
					? (raw["ogImage"] as ImageMetadata)
					: undefined,
		};
	}
}
