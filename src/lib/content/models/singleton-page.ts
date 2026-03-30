import type { MetaData } from "./meta-data";

/** Singleton page (home, about-me) for the portal (CMS-agnostic). */

export type SingletonPage = {
	documentId: string;
	slug: string;
	title: string;
	heading: string;
	subHeading: string | null;
	heroImageUrl: string | null;
	heroImageAlt: string;
	bodyHtml: string;
	/** Strapi `publishedAt`, when present. */
	publishedAt: Date | null;
	metaData: MetaData;
};
