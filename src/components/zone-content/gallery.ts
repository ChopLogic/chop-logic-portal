import type { GalleryItem, ImageSource } from "chop-logic-components";
import { DEFAULT_ALT_TEXT } from "../../constants/defaults";
import type {
	CmsImage,
	CmsImageFormatName,
	CmsImageFormats,
} from "../../lib/content/models";

const sourceDescriptorByFormatVariantName: Record<CmsImageFormatName, string> =
	{
		thumbnail: "245w",
		small: "500w",
		medium: "750w",
		large: "1000w",
	};

export function mapCMSImageFormatsToSources(
	formats: CmsImageFormats,
): ImageSource[] {
	const sources: ImageSource[] = [];

	// Sort formats by width (smallest first)
	const formatOrder: CmsImageFormatName[] = ["small", "medium", "large"];

	for (const formatName of formatOrder) {
		const variant = formats[formatName];
		if (!variant) continue;

		sources.push({
			src: variant.url,
			type: variant.mime || "image/jpeg",
			descriptor: sourceDescriptorByFormatVariantName[formatName],
		});
	}

	return sources;
}

export function mapCMSImageToGalleryItem(
	image: CmsImage,
	aspectRatio?: string,
): GalleryItem {
	const fallbackImage =
		image.formats.small ?? image.formats.medium ?? image.formats.large ?? image;

	const sources = mapCMSImageFormatsToSources(image.formats);
	const alt = image?.alternativeText ?? DEFAULT_ALT_TEXT;
	const sizes = `(max-width: 500px) 500px, (max-width: 750px) 750px, 1000px`;

	return {
		src: fallbackImage.url,
		alt,
		sources,
		sizes,
		aspectRatio,
		loading: "lazy",
	};
}
