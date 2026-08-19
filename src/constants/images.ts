import type { CmsImageFormatName } from "@models";

export const IMAGE_FORMAT_NAMES: readonly CmsImageFormatName[] = [
	"thumbnail",
	"small",
	"medium",
	"large",
];

export const SOURCE_DESCRIPTOR_BY_FORMAT_NAME: Record<
	CmsImageFormatName,
	string
> = {
	thumbnail: "245w",
	small: "500w",
	medium: "750w",
	large: "1000w",
};
