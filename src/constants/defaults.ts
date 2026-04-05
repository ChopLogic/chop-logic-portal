import { type MetaData, OgType, type OpenGraph } from "../lib/content/models";

export const DEFAULT_SITE_TITLE = "Chop Logic";
export const DEFAULT_SITE_DESCRIPTION = "A place where logic works";
export const DEFAULT_OPEN_GRAPH: OpenGraph = {
	ogDescription: DEFAULT_SITE_DESCRIPTION,
	ogTitle: DEFAULT_SITE_TITLE,
	ogType: OgType.WEBSITE,
};
export const DEFAULT_META_DATA: MetaData = {
	metaTitle: DEFAULT_SITE_TITLE,
	metaDescription: DEFAULT_SITE_DESCRIPTION,
	robots: "index, follow",
	openGraph: DEFAULT_OPEN_GRAPH,
};
