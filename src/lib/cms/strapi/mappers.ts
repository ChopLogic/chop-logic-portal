import type {
	ArticleDetail,
	ArticleSummary,
	SingletonPage,
} from "../../content/types";
import { blocksToHtml, blocksToPlainText } from "./blocks";
import { dynamicZoneToHtml } from "./dynamic-zone";
import { mediaAlt, resolveMediaUrl } from "./media";
import type { StrapiArticleEntity, StrapiSingletonEntity } from "./schemas";

function isRecord(v: unknown): v is Record<string, unknown> {
	return typeof v === "object" && v !== null && !Array.isArray(v);
}

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

function articleDescription(entity: StrapiArticleEntity): string {
	const seo = mapSeo(entity.metaData);
	if (seo.metaDescription.length > 0) {
		return seo.metaDescription;
	}
	return blocksToPlainText(entity.summary);
}

export function mapArticleToSummary(
	baseUrl: string,
	entity: StrapiArticleEntity,
): ArticleSummary {
	const previewUrl = resolveMediaUrl(baseUrl, entity.preview);
	const previewAlt = isRecord(entity.preview) ? mediaAlt(entity.preview) : "";
	const updated =
		typeof entity.updatedAt === "string"
			? new Date(entity.updatedAt)
			: undefined;
	return {
		documentId: entity.documentId,
		slug: entity.slug,
		title: entity.title,
		description: articleDescription(entity),
		pubDate: new Date(entity.publicationDate),
		updatedDate: Number.isNaN(updated?.getTime() ?? NaN) ? undefined : updated,
		heroImageUrl: previewUrl,
		heroImageAlt: previewAlt,
	};
}

export function mapArticleToDetail(
	baseUrl: string,
	entity: StrapiArticleEntity,
): ArticleDetail {
	const summary = mapArticleToSummary(baseUrl, entity);
	const bodyFromZone = dynamicZoneToHtml(baseUrl, entity.content);
	const summaryHtml = blocksToHtml(entity.summary);
	const bodyHtml =
		bodyFromZone.length > 0 ? `${summaryHtml}${bodyFromZone}` : summaryHtml;
	return {
		...summary,
		bodyHtml,
	};
}

export function mapSingletonToPage(
	baseUrl: string,
	entity: StrapiSingletonEntity,
): SingletonPage {
	const seo = mapSeo(entity.metaData);
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
		heading: entity.heading,
		subHeading:
			typeof entity.subHeading === "string" ? entity.subHeading : null,
		seo:
			seo.metaTitle.length > 0 || seo.metaDescription.length > 0
				? seo
				: {
						metaTitle: entity.title,
						metaDescription: entity.heading,
					},
		heroImageUrl,
		heroImageAlt,
		bodyHtml: dynamicZoneToHtml(baseUrl, entity.content),
		publishedAt:
			publishedAt && !Number.isNaN(publishedAt.getTime()) ? publishedAt : null,
	};
}
