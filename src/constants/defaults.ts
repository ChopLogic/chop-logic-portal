import fallbackOgAsset from "../assets/Chop-Logic-Logo-Horizontal-612x306-white-bg.png";
import {
	type MetaData,
	OgType,
	type OpenGraph,
	type OpenGraphImageMeta,
} from "../lib/content/models";

export const DEFAULT_SITE_TITLE = "Chop Logic";
export const DEFAULT_SITE_DESCRIPTION = "A place where logic works";

/** Bundled logo for OG/Twitter when the CMS has no `ogImage`. */
export const OPEN_GRAPH_FALLBACK_IMAGE: OpenGraphImageMeta = {
	src: fallbackOgAsset.src,
	width: fallbackOgAsset.width,
	height: fallbackOgAsset.height,
};

export const DEFAULT_OPEN_GRAPH: OpenGraph = {
	ogDescription: DEFAULT_SITE_DESCRIPTION,
	ogTitle: DEFAULT_SITE_TITLE,
	ogType: OgType.WEBSITE,
	ogImage: OPEN_GRAPH_FALLBACK_IMAGE,
};

export const DEFAULT_ROBOTS = "index, follow";

export const DEFAULT_META_DATA: MetaData = {
	metaTitle: DEFAULT_SITE_TITLE,
	metaDescription: DEFAULT_SITE_DESCRIPTION,
	robots: DEFAULT_ROBOTS,
	openGraph: DEFAULT_OPEN_GRAPH,
};
