import type { DynamicZoneContent } from "./dynamic-zone";
import type { MetaData } from "./meta-data";

export interface DynamicContentPage {
	readonly documentId: string;
	readonly title: string;
	readonly subTitle?: string;
	readonly slug: string;
	readonly updatedAt: Date;
	readonly content: DynamicZoneContent;
	readonly metaData: MetaData;
}
