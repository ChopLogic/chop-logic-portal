import {
	CALL_TO_ACTION_PROJECTION,
	EMBEDDED_VIDEO_PROJECTION,
	GALLERY_PROJECTION,
	MEDIA_PROJECTION,
	METADATA_PROJECTION,
	PARAGRAPH_PROJECTION,
} from "./projections";

export const ABOUT_ME_QUERY = /* GraphQL */ `
  query FetchAboutMePage {
    aboutMe {
        documentId
        updatedAt
        title
        subTitle
        slug
        content {
            ... on ComponentSectionsParagraph {
            ${PARAGRAPH_PROJECTION}
            }
            ... on ComponentSectionsGallery {
            ${GALLERY_PROJECTION}
            }
            ... on ComponentSectionsEmbeddedVideo {
            ${EMBEDDED_VIDEO_PROJECTION}
            }
            ... on ComponentSectionsCallToAction {
            ${CALL_TO_ACTION_PROJECTION}
            }
            ... on ComponentSectionsMedia {
            ${MEDIA_PROJECTION}
            }
        }
        metaData {
            ${METADATA_PROJECTION}
        }
    }
}
`;
