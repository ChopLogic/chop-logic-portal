import type { JsonValue } from "./json";

export interface MetaData {
	metaTitle: string;
	metaDescription: string;
	canonicalURL?: string;
	keywords?: string;
	authorName?: string;
	robots?: Robots;
	structuredData?: JsonValue;
	openGraph?: OpenGraph;
}

/** Absolute `src` for OG/Twitter tags (Astro-friendly, no Strapi-relative paths). */
export interface OpenGraphImageMeta {
	readonly src: string;
	readonly width?: number;
	readonly height?: number;
}

export interface OpenGraph {
	ogDescription: string;
	ogTitle: string;
	ogType: OgType;
	ogImage?: OpenGraphImageMeta;
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
