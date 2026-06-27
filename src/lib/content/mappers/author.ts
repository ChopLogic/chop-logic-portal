/** biome-ignore-all lint/complexity/useLiteralKeys: dynamic Strapi media keys */

import type { ArticleAuthorConnection } from "../models/article";
import { isRecord } from "./checkers";
import { normalizeRequiredString } from "./normalizers";

function normalizeArticleAuthorConnection(
	raw: unknown,
): ArticleAuthorConnection {
	if (!isRecord(raw)) {
		throw new Error(`Expected a record, got ${JSON.stringify(raw)}`);
	}

	return {
		id: normalizeRequiredString(raw["documentId"]),
		name: normalizeRequiredString(raw["name"]),
		email: normalizeRequiredString(raw["email"]),
	};
}

export function mapArticleAuthorConnections(
	rawConnections: unknown[] | null | undefined,
): ArticleAuthorConnection[] {
	if (!rawConnections) {
		throw new Error(
			`Invalid article to authors array provided: ${JSON.stringify(rawConnections)}`,
		);
	}

	return rawConnections.map(normalizeArticleAuthorConnection);
}
