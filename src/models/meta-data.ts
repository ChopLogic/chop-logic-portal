import type { JsonValue } from "./json";

export interface MetaData {
	metaTitle: string;
	metaDescription: string;
	canonicalURL?: string;
	keywords?: string;
	authorName?: string;
	robots?: string;
	structuredData?: JsonValue;
	openGraph: OpenGraph;
}

export interface OpenGraphImageMeta {
	readonly src: string;
	readonly width?: number;
	readonly height?: number;
}

export interface OpenGraph {
	ogDescription: string;
	ogTitle: string;
	ogType: OgType;
	ogImage: OpenGraphImageMeta;
}

export enum OgType {
	ARTICLE = "article",
	WEBSITE = "website",
}
