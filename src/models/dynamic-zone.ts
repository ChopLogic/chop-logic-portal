import type { GalleryItem, ImageProps } from "chop-logic-components";
import type { Link } from "./link";
import type { RichTextContent } from "./rich-text-block";
import type { EmbedVideoSource } from "./video";

export enum DynamicZoneComponentType {
	Paragraph = "paragraph",
	CallToAction = "call-to-action",
	Gallery = "gallery",
	EmbeddedVideo = "embedded-video",
	ReferenceList = "reference-list",
	Picture = "picture",
}

export interface DynamicZoneParagraph {
	readonly type: DynamicZoneComponentType.Paragraph;
	readonly id: string;
	readonly heading: string;
	readonly subHeading?: string;
	readonly content: RichTextContent;
	readonly alignment: "left" | "center" | "right";
}

export interface DynamicZoneCallToAction {
	readonly type: DynamicZoneComponentType.CallToAction;
	readonly id: string;
	readonly heading: string;
	readonly subHeading?: string;
	readonly link: Link;
	readonly picture?: ImageProps;
}

export interface DynamicZoneGallery {
	readonly type: DynamicZoneComponentType.Gallery;
	readonly id: string;
	readonly heading: string;
	readonly subHeading?: string;
	readonly layout: "grid" | "masonry" | "carousel";
	readonly items: GalleryItem[];
	readonly aspectRatio?: string;
}

export interface DynamicZoneEmbeddedVideo {
	readonly type: DynamicZoneComponentType.EmbeddedVideo;
	readonly id: string;
	readonly heading: string;
	readonly subHeading?: string;
	readonly aspectRatio?: string;
	readonly link: Link;
	readonly embed: EmbedVideoSource | null;
}

export interface DynamicZoneReferenceList {
	readonly type: DynamicZoneComponentType.ReferenceList;
	readonly id: string;
	readonly heading: string;
	readonly subHeading?: string;
	readonly links: Link[];
}

export interface DynamicZonePicture {
	readonly type: DynamicZoneComponentType.Picture;
	readonly id: string;
	readonly item: ImageProps;
	readonly publicationDate: Date;
	readonly aspectRatio?: string;
}

export type DynamicZoneComponent =
	| DynamicZoneParagraph
	| DynamicZoneCallToAction
	| DynamicZoneGallery
	| DynamicZoneEmbeddedVideo
	| DynamicZoneReferenceList
	| DynamicZonePicture;

export type DynamicZoneContent = readonly DynamicZoneComponent[];
