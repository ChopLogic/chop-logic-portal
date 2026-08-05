import type { Author, ImageProps, TagData } from "chop-logic-components";
import { DEFAULT_ALT_TEXT, DEFAULT_IMAGE } from "../../constants/defaults";
import type {
	ArticleAuthorConnection,
	CmsImage,
	Tag,
} from "../../lib/content/models";

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

function mapStrapiTagToPreviewTag(tag: Tag): TagData {
	return {
		id: tag.id,
		name: tag.name,
		description: tag.description,
		color: tag.color,
	};
}

export function getPreviewAuthors(
	connections: ArticleAuthorConnection[],
): Author[] {
	return connections.map(mapStrapiAuthorConnectionToAuthorPreview);
}

export function getPreviewTags(tags: Tag[]): TagData[] {
	return tags.map(mapStrapiTagToPreviewTag);
}

export function getPreviewImage(preview?: CmsImage): ImageProps {
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
