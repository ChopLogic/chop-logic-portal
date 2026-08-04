import type { Author } from "chop-logic-components";
import type { ArticleAuthorConnection } from "../../lib/content/models";

export function mapStrapiAuthorConnectionToAuthorPreview(
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
