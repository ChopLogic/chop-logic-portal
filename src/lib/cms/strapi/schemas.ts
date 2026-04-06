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

const tagSchema = z
	.object({
		documentId: z.string(),
		name: z.string(),
		slug: z.string(),
		description: z.string().nullable().optional(),
	})
	.passthrough();

const authorNodeSchema = z
	.object({
		documentId: z.string(),
		name: z.string(),
		email: z.string(),
	})
	.passthrough();

const authorsConnectionSchema = z.object({
	nodes: z.array(authorNodeSchema),
});

/** Article fields from Strapi (GraphQL-normalized or REST). */
export const strapiArticleEntitySchema = z
	.object({
		documentId: z.string(),
		title: z.string(),
		subTitle: z.string().nullable().optional(),
		slug: z.string(),
		publicationDate: z.string(),
		publishedAt: z.string().nullable().optional(),
		updatedAt: z.string().optional(),
		summary: z.unknown().optional(),
		preview: z.unknown().nullable().optional(),
		metaData: z.unknown().optional(),
		content: z.unknown().optional(),
		tags: z.array(tagSchema).optional(),
		authors_connection: authorsConnectionSchema.optional(),
	})
	.passthrough();

export const strapiSingletonEntitySchema = z
	.object({
		documentId: z.string(),
		title: z.string(),
		heading: z.string().optional(),
		subTitle: z.string().nullable().optional(),
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
		siteTitle: z.string().optional(),
		title: z.string().optional(),
		description: z.string().optional(),
		footerText: z.string().optional(),
		footer: z.unknown().optional(),
		links: z.array(z.unknown()),
		logo: z.unknown().nullable().optional(),
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
