/** biome-ignore-all lint/complexity/useLiteralKeys: dynamic Strapi media keys */

import type { ArticleAuthorConnection } from "@models";
import { isRecord } from "./checkers";
import { mapCmsImage } from "./image";
import { normalizeRequiredString } from "./normalizers";

export function mapArticleAuthorConnections(
	rawConnections: unknown[] | null | undefined,
	apiUrl: string,
): ArticleAuthorConnection[] {
	if (!rawConnections) {
		throw new Error(
			`Invalid article to authors array provided: ${JSON.stringify(rawConnections)}`,
		);
	}

	return rawConnections.map((connection) =>
		normalizeArticleAuthorConnection(connection, apiUrl),
	);
}

function normalizeArticleAuthorConnection(
	raw: unknown,
	apiUrl: string,
): ArticleAuthorConnection {
	if (!isRecord(raw)) {
		throw new Error(`Expected a record, got ${JSON.stringify(raw)}`);
	}

	return {
		id: normalizeRequiredString(raw["documentId"]),
		name: normalizeRequiredString(raw["name"]),
		email: normalizeRequiredString(raw["email"]),
		avatar: mapCmsImage(raw["avatar"], apiUrl),
	};
}
