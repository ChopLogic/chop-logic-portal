import type { StrapiDynamicContentPageEntity } from "../../strapi/schemas";
import type { DynamicContentPage } from "../models/dynamic-content-page";
import { mapDynamicZoneContent } from "./dynamic-zone";
import { mapMetaData } from "./meta-data";
import {
	normalizeOptionalString,
	normalizeRequiredDate,
	normalizeRequiredString,
} from "./normalizers";

export function mapDynamicContentPage(
	entity: StrapiDynamicContentPageEntity,
	baseUrl: string,
): DynamicContentPage {
	return {
		id: entity.documentId,
		title: normalizeRequiredString(entity.title),
		subTitle: normalizeOptionalString(entity.subTitle),
		slug: normalizeRequiredString(entity.slug),
		updatedAt: normalizeRequiredDate(entity.updatedAt),
		content: mapDynamicZoneContent(entity.content),
		metaData: mapMetaData(entity.metaData, baseUrl),
	};
}
