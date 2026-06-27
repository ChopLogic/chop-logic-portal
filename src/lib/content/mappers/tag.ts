/** biome-ignore-all lint/complexity/useLiteralKeys: dynamic Strapi media keys */
import type { Tag } from "../models";
import { isRecord } from "./checkers";
import {
	normalizeOptionalString,
	normalizeRequiredString,
} from "./normalizers";

function normalizeTag(raw: unknown): Tag {
	if (!isRecord(raw)) {
		throw new Error(`Expected a record, got ${JSON.stringify(raw)}`);
	}

	return {
		id: normalizeRequiredString(raw["documentId"]),
		name: normalizeRequiredString(raw["name"]),
		slug: normalizeRequiredString(raw["slug"]),
		description: normalizeOptionalString(raw["description"]),
		color: normalizeOptionalString(raw["color"]),
	};
}

export function mapTags(rawTags: unknown[] | null | undefined): Tag[] {
	if (!rawTags) {
		throw new Error(`Invalid tags array provided: ${JSON.stringify(rawTags)}`);
	}

	return rawTags.map(normalizeTag);
}
