import type { StrapiArticleEntity } from "../../strapi/schemas";
import type { ArticlePage, ArticleSummary } from "../models";
import { mapArticleAuthorConnections } from "./author";
import { mapDynamicZoneContent } from "./dynamic-zone";
import { mapMetaData } from "./meta-data";
import {
	normalizeOptionalString,
	normalizeRequiredDate,
	normalizeRequiredString,
} from "./normalizers";
import { mapRichTextBlock } from "./rich-text-block";
import { mapTags } from "./tag";

export function mapArticlePage(
	entity: StrapiArticleEntity,
	baseUrl: string,
): ArticlePage {
	return {
		id: entity.documentId,
		title: normalizeRequiredString(entity.title),
		subTitle: normalizeOptionalString(entity.subTitle),
		publicationDate: normalizeRequiredDate(entity.publicationDate),
		slug: normalizeRequiredString(entity.slug),
		updatedAt: normalizeRequiredDate(entity.updatedAt),
		content: mapDynamicZoneContent(entity.content),
		excerpt: normalizeRequiredString(entity.excerpt),
		summary: mapRichTextBlock(entity.summary),
		authors: mapArticleAuthorConnections(entity.authors_connection?.nodes),
		tags: mapTags(entity.tags),
		metaData: mapMetaData(entity.metaData, baseUrl),
	};
}

export function mapArticleSummary(entity: StrapiArticleEntity): ArticleSummary {
	return {
		id: entity.documentId,
		title: normalizeRequiredString(entity.title),
		subTitle: normalizeOptionalString(entity.subTitle),
		publicationDate: normalizeRequiredDate(entity.publicationDate),
		slug: normalizeRequiredString(entity.slug),
		updatedAt: normalizeRequiredDate(entity.updatedAt),
		excerpt: normalizeRequiredString(entity.excerpt),
		authors: mapArticleAuthorConnections(entity.authors_connection?.nodes),
		tags: mapTags(entity.tags),
	};
}
