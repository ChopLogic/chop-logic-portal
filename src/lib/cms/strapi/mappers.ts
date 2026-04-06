import { isRecord } from "../../checks";
import {
	cmsImageDefaultSrc,
	mapCmsImage,
	mapMetaData,
} from "../../content/mappers";
import {
	parseRichTextDocument,
	richTextToHtml,
} from "../../content/mappers/rich-text";
import type {
	ArticleAuthor,
	ArticleDetail,
	ArticleSummary,
	ArticleTag,
	SingletonPage,
} from "../../content/models";
import { blocksToPlainText } from "./blocks";
import { dynamicZoneToHtml } from "./dynamic-zone";
import { mediaAlt, resolveMediaUrl } from "./media";
import type { StrapiArticleEntity, StrapiSingletonEntity } from "./schemas";

function mapSeo(raw: unknown): { metaTitle: string; metaDescription: string } {
	if (!isRecord(raw)) {
		return { metaTitle: "", metaDescription: "" };
	}
	return {
		metaTitle: typeof raw["metaTitle"] === "string" ? raw["metaTitle"] : "",
		metaDescription:
			typeof raw["metaDescription"] === "string" ? raw["metaDescription"] : "",
	};
}

function mapArticleTags(entity: StrapiArticleEntity): ArticleTag[] {
	const tags = entity.tags;
	if (!Array.isArray(tags)) {
		return [];
	}
	const out: ArticleTag[] = [];
	for (const t of tags) {
		if (
			typeof t.documentId === "string" &&
			typeof t.name === "string" &&
			typeof t.slug === "string"
		) {
			out.push({
				documentId: t.documentId,
				name: t.name,
				slug: t.slug,
				description:
					typeof t.description === "string"
						? t.description
						: t.description === null
							? null
							: null,
			});
		}
	}
	return out;
}

function mapArticleAuthors(entity: StrapiArticleEntity): ArticleAuthor[] {
	const conn = entity.authors_connection;
	if (!conn?.nodes || !Array.isArray(conn.nodes)) {
		return [];
	}
	return conn.nodes.map((n) => ({
		documentId: n.documentId,
		name: n.name,
		email: n.email,
	}));
}

function articleDescription(entity: StrapiArticleEntity): string {
	const seo = mapSeo(entity.metaData);
	if (seo.metaDescription.length > 0) {
		return seo.metaDescription;
	}
	const summaryDoc = parseRichTextDocument(entity.summary);
	if (summaryDoc) {
		return blocksToPlainText(summaryDoc);
	}
	return blocksToPlainText(entity.summary);
}

export function mapArticleToSummary(
	baseUrl: string,
	entity: StrapiArticleEntity,
	siteTitle: string,
): ArticleSummary {
	const previewImage = mapCmsImage(entity.preview);
	const heroImageUrl = previewImage
		? cmsImageDefaultSrc(previewImage, baseUrl)
		: null;
	const previewAlt = previewImage?.alternativeText?.trim()
		? previewImage.alternativeText
		: (previewImage?.name ?? "");
	const updated =
		typeof entity.updatedAt === "string"
			? new Date(entity.updatedAt)
			: undefined;
	const subTitle =
		typeof entity.subTitle === "string"
			? entity.subTitle
			: entity.subTitle === null
				? null
				: null;

	return {
		documentId: entity.documentId,
		slug: entity.slug,
		title: entity.title,
		subTitle,
		description: articleDescription(entity),
		pubDate: new Date(entity.publicationDate),
		updatedDate: Number.isNaN(updated?.getTime() ?? NaN) ? undefined : updated,
		heroImageUrl,
		heroImageAlt: previewAlt,
		previewImage,
		tags: mapArticleTags(entity),
		authors: mapArticleAuthors(entity),
		metaData: mapMetaData(entity.metaData, baseUrl, siteTitle),
	};
}

export function mapArticleToDetail(
	baseUrl: string,
	entity: StrapiArticleEntity,
	siteTitle: string,
): ArticleDetail {
	const summary = mapArticleToSummary(baseUrl, entity, siteTitle);
	const bodyFromZone = dynamicZoneToHtml(baseUrl, entity.content);
	const summaryHtml = (() => {
		const doc = parseRichTextDocument(entity.summary);
		return doc ? richTextToHtml(doc) : blocksToHtmlFromUnknown(entity.summary);
	})();
	const bodyHtml =
		bodyFromZone.length > 0 ? `${summaryHtml}${bodyFromZone}` : summaryHtml;
	return {
		...summary,
		bodyHtml,
	};
}

function blocksToHtmlFromUnknown(raw: unknown): string {
	const doc = parseRichTextDocument(raw);
	return doc ? richTextToHtml(doc) : "";
}

export function mapSingletonToPage(
	baseUrl: string,
	entity: StrapiSingletonEntity,
	siteTitle: string,
): SingletonPage {
	const metaData = mapMetaData(entity.metaData, baseUrl, siteTitle);
	const heading =
		typeof entity.heading === "string" && entity.heading.length > 0
			? entity.heading
			: entity.title;
	const subHeading = entity.subHeading ?? entity.subTitle ?? null;
	const hero = entity.heroImage;
	let heroImageUrl: string | null = null;
	let heroImageAlt = "";
	if (hero != null) {
		if (isRecord(hero) && hero["__component"] === "sections.picture") {
			heroImageUrl = resolveMediaUrl(baseUrl, hero["image"]);
			const altText = hero["altText"];
			heroImageAlt =
				typeof altText === "string" ? altText : mediaAlt(hero["image"]);
		} else {
			heroImageUrl = resolveMediaUrl(baseUrl, hero);
			heroImageAlt = mediaAlt(hero);
		}
	}
	const publishedRaw = entity.publishedAt;
	const publishedAt =
		typeof publishedRaw === "string" && publishedRaw.length > 0
			? new Date(publishedRaw)
			: null;

	return {
		documentId: entity.documentId,
		slug: entity.slug,
		title: entity.title,
		heading,
		subHeading: typeof subHeading === "string" ? subHeading : null,
		metaData,
		heroImageUrl,
		heroImageAlt,
		bodyHtml: dynamicZoneToHtml(baseUrl, entity.content),
		publishedAt:
			publishedAt && !Number.isNaN(publishedAt.getTime()) ? publishedAt : null,
	};
}
