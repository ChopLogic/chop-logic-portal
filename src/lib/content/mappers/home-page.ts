import type { HomePage } from "../models/home-page";
import { mapDynamicZoneContent } from "./dynamic-zone";
import { normalizeOptionalString, normalizeRequiredString } from "./helpers";
import { mapMetaData } from "./meta-data";

function parseUpdatedAt(value: unknown): Date {
	if (typeof value === "string" && value.length > 0) {
		const date = new Date(value);
		if (!Number.isNaN(date.getTime())) {
			return date;
		}
	}
	return new Date(0);
}

export function mapHomePage(
	entity: {
		documentId: string;
		title: string;
		subTitle?: string | null;
		slug: string;
		updatedAt?: string;
		content?: unknown;
		metaData?: unknown;
	},
	baseUrl: string,
): HomePage {
	return {
		documentId: entity.documentId,
		title: normalizeRequiredString(entity.title),
		subTitle: normalizeOptionalString(entity.subTitle),
		slug: normalizeRequiredString(entity.slug),
		updatedAt: parseUpdatedAt(entity.updatedAt),
		content: mapDynamicZoneContent(entity.content),
		metaData: mapMetaData(entity.metaData, baseUrl),
	};
}
