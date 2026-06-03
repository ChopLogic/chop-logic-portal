import type { DynamicContentPage } from "../models/dynamic-content-page";
import { mapDynamicZoneContent } from "./dynamic-zone";
import {
	normalizeOptionalString,
	normalizeRequiredDate,
	normalizeRequiredString,
} from "./helpers";
import { mapMetaData } from "./meta-data";

export function mapDynamicContentPage(
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
): DynamicContentPage {
	return {
		documentId: entity.documentId,
		title: normalizeRequiredString(entity.title),
		subTitle: normalizeOptionalString(entity.subTitle),
		slug: normalizeRequiredString(entity.slug),
		updatedAt: normalizeRequiredDate(entity.updatedAt),
		content: mapDynamicZoneContent(entity.content),
		metaData: mapMetaData(entity.metaData, baseUrl),
	};
}
