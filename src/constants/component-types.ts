import { DynamicZoneComponentType } from "../lib/content/models/dynamic-zone";

export const GRAPHQL_TYPENAME_TO_COMPONENT_TYPE: Record<
	string,
	DynamicZoneComponentType
> = {
	ComponentSectionsParagraph: DynamicZoneComponentType.Paragraph,
	ComponentSectionsCallToAction: DynamicZoneComponentType.CallToAction,
	ComponentSectionsEmbeddedVideo: DynamicZoneComponentType.EmbeddedVideo,
	ComponentSectionsReferenceList: DynamicZoneComponentType.ReferenceList,
	ComponentSectionsPicture: DynamicZoneComponentType.Picture,
	ComponentSectionsGallery: DynamicZoneComponentType.Gallery,
};

export const REST_COMPONENT_TO_COMPONENT_TYPE: Record<
	string,
	DynamicZoneComponentType
> = {
	"sections.paragraph": DynamicZoneComponentType.Paragraph,
	"sections.call-to-action": DynamicZoneComponentType.CallToAction,
	"sections.embedded-video": DynamicZoneComponentType.EmbeddedVideo,
	"sections.reference-list": DynamicZoneComponentType.ReferenceList,
	"sections.picture": DynamicZoneComponentType.Picture,
	"sections.gallery": DynamicZoneComponentType.Gallery,
};
