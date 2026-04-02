import {
	CALL_TO_ACTION_PROJECTION,
	EMBEDDED_VIDEO_PROJECTION,
	GALLERY_PROJECTION,
	MEDIA_PROJECTION,
	METADATA_PROJECTION,
	PARAGRAPH_PROJECTION,
	REFERENCE_LIST_PROJECTION,
	TAG_PROJECTION,
} from "./projections";

export const ARTICLES_QUERY = /* GraphQL */ `
query FetchAllArticles {
  articles {
    documentId
    title
    subTitle
    slug
    publicationDate
    updatedAt
    summary
    tags {
      ${TAG_PROJECTION}
    }
    authors_connection {
      nodes {
        name
        email
        documentId
      }
    }
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
        ... on ComponentSectionsReferenceList {
          ${REFERENCE_LIST_PROJECTION}
        }
    }
    metaData {
        ${METADATA_PROJECTION}
    }
  }
}
`;
