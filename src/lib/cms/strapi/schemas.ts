import { z } from "zod";

/** Strapi 5 REST list envelope. */
export const strapiListResponseSchema = z
	.object({
		data: z.array(z.record(z.unknown())),
		meta: z.record(z.unknown()).optional(),
	})
	.passthrough();

/** Strapi 5 REST single / one entry envelope. */
export const strapiSingleResponseSchema = z
	.object({
		data: z.record(z.unknown()).nullable(),
		meta: z.record(z.unknown()).optional(),
	})
	.passthrough();

/** Flattened article fields from Strapi 5 REST. */
export const strapiArticleEntitySchema = z
	.object({
		documentId: z.string(),
		title: z.string(),
		slug: z.string(),
		publicationDate: z.string(),
		publishedAt: z.string().nullable().optional(),
		updatedAt: z.string().optional(),
		summary: z.unknown().optional(),
		preview: z.unknown().optional(),
		metaData: z.unknown().optional(),
		content: z.unknown().optional(),
	})
	.passthrough();

export const strapiSingletonEntitySchema = z
	.object({
		documentId: z.string(),
		title: z.string(),
		heading: z.string(),
		subHeading: z.string().nullable().optional(),
		slug: z.string(),
		heroImage: z.unknown().optional(),
		content: z.unknown().optional(),
		metaData: z.unknown().optional(),
		updatedAt: z.string().optional(),
		publishedAt: z.string().nullable().optional(),
	})
	.passthrough();

export const strapiConfigEntitySchema = z
	.object({
		documentId: z.string(),
		siteTitle: z.string(),
		footerText: z.string(),
		socialLinks: z.array(z.unknown()),
	})
	.passthrough();

export type StrapiArticleEntity = z.infer<typeof strapiArticleEntitySchema>;
export type StrapiSingletonEntity = z.infer<typeof strapiSingletonEntitySchema>;
export type StrapiConfigEntity = z.infer<typeof strapiConfigEntitySchema>;

export function parseStrapiList(json: unknown) {
	return strapiListResponseSchema.parse(json);
}

export function parseStrapiSingle(json: unknown) {
	return strapiSingleResponseSchema.parse(json);
}

export function parseArticleEntity(raw: unknown): StrapiArticleEntity {
	return strapiArticleEntitySchema.parse(raw);
}

export function parseSingletonEntity(raw: unknown): StrapiSingletonEntity {
	return strapiSingletonEntitySchema.parse(raw);
}

export function parseConfigEntity(raw: unknown): StrapiConfigEntity {
	return strapiConfigEntitySchema.parse(raw);
}
