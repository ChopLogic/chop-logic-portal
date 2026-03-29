export interface MetaData {
	metaTitle: string;
	metaDescription: string;
	canonicalURL?: string;
	keywords?: string;
	authorName?: string;
	robots?: Robots;
	structuredData?: unknown;
	openGraph?: OpenGraph;
}

export interface OpenGraph {
	ogDescription: string;
	ogTitle: string;
	ogType: OgType;
	ogImage?: ImageMetadata;
}

export enum Robots {
	INDEX = "index",
	FOLLOW = "follow",
	NOINDEX = "noindex",
	NOFOLLOW = "nofollow",
}

export enum OgType {
	ARTICLE = "article",
	WEBSITE = "website",
}
