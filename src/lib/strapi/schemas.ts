import { z } from "zod";

export const strapiListResponseSchema = z.looseObject({
	data: z.array(z.record(z.string(), z.unknown())),
	meta: z.record(z.string(), z.unknown()).optional(),
});

export const strapiSingleResponseSchema = z.looseObject({
	data: z.record(z.string(), z.unknown()).nullable(),
	meta: z.record(z.string(), z.unknown()).optional(),
});

const tagSchema = z.looseObject({
	documentId: z.string(),
	name: z.string(),
	slug: z.string(),
	description: z.string().nullable().optional(),
	color: z.string().nullable().optional(),
});

const authorNodeSchema = z.looseObject({
	documentId: z.string(),
	name: z.string(),
	email: z.string(),
});

const authorsConnectionSchema = z.object({
	nodes: z.array(authorNodeSchema),
});

export const strapiArticleEntitySchema = z.looseObject({
	documentId: z.string(),
	title: z.string(),
	subTitle: z.string().nullable().optional(),
	slug: z.string(),
	updatedAt: z.string(),
	publicationDate: z.string(),
	excerpt: z.string(),
	summary: z.unknown().optional(),
	preview: z.unknown().nullable().optional(),
	content: z.unknown().optional(),
	tags: z.array(tagSchema).optional(),
	authors_connection: authorsConnectionSchema.optional(),
	metaData: z.unknown().optional(),
});

export const strapiArticleSummaryEntitySchema = z.looseObject({
	documentId: z.string(),
	title: z.string(),
	subTitle: z.string().nullable().optional(),
	slug: z.string(),
	updatedAt: z.string(),
	publicationDate: z.string(),
	excerpt: z.string(),
	preview: z.unknown().nullable().optional(),
	tags: z.array(tagSchema).optional(),
	authors_connection: authorsConnectionSchema.optional(),
});

export const strapiDynamicContentPageEntitySchema = z.looseObject({
	documentId: z.string(),
	title: z.string(),
	subTitle: z.string().nullable().optional(),
	slug: z.string(),
	updatedAt: z.string().optional(),
	content: z.unknown().optional(),
	metaData: z.unknown().optional(),
});

export const strapiConfigEntitySchema = z.looseObject({
	documentId: z.string(),
	title: z.string(),
	description: z.string(),
	footer: z.unknown(),
	links: z.array(z.unknown()),
	logo: z.unknown().nullable().optional(),
});

export type StrapiArticleEntity = z.infer<typeof strapiArticleEntitySchema>;
export type StrapiDynamicContentPageEntity = z.infer<
	typeof strapiDynamicContentPageEntitySchema
>;
export type StrapiConfigEntity = z.infer<typeof strapiConfigEntitySchema>;
export type StrapiArticleSummaryEntity = z.infer<
	typeof strapiArticleSummaryEntitySchema
>;

export function parseArticleEntity(raw: unknown): StrapiArticleEntity {
	return strapiArticleEntitySchema.parse(raw);
}

export function parseSingletonEntity(
	raw: unknown,
): StrapiDynamicContentPageEntity {
	return strapiDynamicContentPageEntitySchema.parse(raw);
}

export function parseConfigEntity(raw: unknown): StrapiConfigEntity {
	return strapiConfigEntitySchema.parse(raw);
}

export function parseArticleSummaryEntity(
	raw: unknown,
): StrapiArticleSummaryEntity {
	return strapiArticleSummaryEntitySchema.parse(raw);
}
