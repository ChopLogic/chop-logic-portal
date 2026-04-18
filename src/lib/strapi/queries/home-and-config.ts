import {
	CALL_TO_ACTION_PROJECTION,
	EMBEDDED_VIDEO_PROJECTION,
	GALLERY_PROJECTION,
	IMAGE_PROJECTION,
	LINK_PROJECTION,
	MEDIA_PROJECTION,
	METADATA_PROJECTION,
	PARAGRAPH_PROJECTION,
} from "./projections";

/** Single round-trip for the home page (hero + site-wide metadata). */
export const HOME_AND_CONFIG_QUERY = /* GraphQL */ `
  query FetchHomeAndConfig {
    home {
      documentId
      title
      subTitle
      slug
      updatedAt
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
    config {
      documentId
      title
      description
      links {
        ${LINK_PROJECTION}
      }
      footer
      logo {
        ${IMAGE_PROJECTION}
      }
      updatedAt
    }
  }
`;
