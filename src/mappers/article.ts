import type { Article } from "@api/types/generated";
import { DEFAULT_ALT_TEXT, DEFAULT_IMAGE } from "@constants";
import type {
	ArticleAuthorConnection,
	ArticlePreview,
	CmsImage,
} from "@models";
import type { Author, ImageProps } from "chop-logic-components";
import { mapArticleAuthorConnections } from "./author";
import { mapCmsImage } from "./image";
import { normalizeRequiredString } from "./normalizers";
import { mapTags } from "./tag";

export function mapArticleToArticlePreview(
	entity: Article,
	apiUrl: string,
): ArticlePreview {
	return {
		id: entity.documentId,
		title: normalizeRequiredString(entity.title),
		slug: normalizeRequiredString(entity.slug),
		summary: normalizeRequiredString(entity.excerpt),
		authors: getPreviewAuthors(
			mapArticleAuthorConnections(entity.authors_connection?.nodes, apiUrl),
		),
		tags: mapTags(entity.tags),
		image: getPreviewImage(mapCmsImage(entity.preview, apiUrl)),
	};
}

function mapStrapiAuthorConnectionToAuthorPreview(
	author: ArticleAuthorConnection,
): Author {
	const avatarUrl =
		author.avatar?.formats.thumbnail?.url ?? author.avatar?.url ?? "";

	return {
		id: author.id,
		name: author.name,
		imageUrl: avatarUrl,
		tooltip: author.role,
	};
}

function getPreviewAuthors(connections: ArticleAuthorConnection[]): Author[] {
	return connections.map(mapStrapiAuthorConnectionToAuthorPreview);
}

function getPreviewImage(preview: CmsImage | null): ImageProps {
	if (!preview) return DEFAULT_IMAGE;

	const imageUrl =
		preview.formats.small?.url ?? preview.url ?? DEFAULT_IMAGE.src;
	const imageAlt = preview.alternativeText ?? DEFAULT_ALT_TEXT;

	return {
		src: imageUrl,
		alt: imageAlt,
		aspectRatio: "16/9",
		loading: "lazy",
	};
}
