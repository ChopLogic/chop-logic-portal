/** biome-ignore-all lint/complexity/useLiteralKeys: dynamic Strapi media keys */

import type { ArticleAuthorConnection } from "@models";
import { isRecord } from "./checkers";
import { mapCmsImage } from "./image";
import { normalizeRequiredString } from "./normalizers";

function normalizeArticleAuthorConnection(
	raw: unknown,
	baseUrl: string,
): ArticleAuthorConnection {
	if (!isRecord(raw)) {
		throw new Error(`Expected a record, got ${JSON.stringify(raw)}`);
	}

	return {
		id: normalizeRequiredString(raw["documentId"]),
		name: normalizeRequiredString(raw["name"]),
		email: normalizeRequiredString(raw["email"]),
		avatar: mapCmsImage(raw["avatar"], baseUrl),
	};
}

export function mapArticleAuthorConnections(
	rawConnections: unknown[] | null | undefined,
	baseUrl: string,
): ArticleAuthorConnection[] {
	if (!rawConnections) {
		throw new Error(
			`Invalid article to authors array provided: ${JSON.stringify(rawConnections)}`,
		);
	}

	return rawConnections.map((connection) =>
		normalizeArticleAuthorConnection(connection, baseUrl),
	);
}
