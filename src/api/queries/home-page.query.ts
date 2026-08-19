import { gql } from "graphql-request";
import {
	CALL_TO_ACTION_FRAGMENT,
	CONFIG_FRAGMENT,
	EMBEDDED_VIDEO_FRAGMENT,
	GALLERY_FRAGMENT,
	MEDIA_FRAGMENT,
	METADATA_FRAGMENT,
	PARAGRAPH_FRAGMENT,
} from "./fragments";

export const HOME_PAGE_QUERY = gql`
  query HomePage {
    home {
      documentId
      title
      subTitle
      slug
      updatedAt
      content {
        ... on ComponentSectionsParagraph {
          ${PARAGRAPH_FRAGMENT}
        }
        ... on ComponentSectionsGallery {
          ${GALLERY_FRAGMENT}
        }
        ... on ComponentSectionsEmbeddedVideo {
          ${EMBEDDED_VIDEO_FRAGMENT}
        }
        ... on ComponentSectionsCallToAction {
          ${CALL_TO_ACTION_FRAGMENT}
        }
        ... on ComponentSectionsMedia {
          ${MEDIA_FRAGMENT}
        }
      }
      metaData {
        ${METADATA_FRAGMENT}
      }
    }
    config {
      ${CONFIG_FRAGMENT}
    }
  }
`;
