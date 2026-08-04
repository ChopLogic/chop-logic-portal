import type { Author, TagData } from "chop-logic-components";
import type { ArticleAuthorConnection, Tag } from "../../lib/content/models";

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
