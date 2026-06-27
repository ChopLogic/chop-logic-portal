import {
	CALL_TO_ACTION_PROJECTION,
	EMBEDDED_VIDEO_PROJECTION,
	GALLERY_PROJECTION,
	IMAGE_PROJECTION,
	LINK_PROJECTION,
	MEDIA_PROJECTION,
	METADATA_PROJECTION,
	PARAGRAPH_PROJECTION,
	REFERENCE_LIST_PROJECTION,
	TAG_PROJECTION,
} from "./projections";

const articleContentFragment = `
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
`;

export const ARTICLE_PAGE_BY_SLUG_QUERY = /* GraphQL */ `
  query FetchArticleBySlug($slug: String!) {
    articles(
      filters: { slug: { eq: $slug } }
      pagination: { limit: 1 }
    ) {
      documentId
      title
      subTitle
      slug
      publicationDate
      updatedAt
      summary
      preview {
        ${IMAGE_PROJECTION}
      }
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
      ${articleContentFragment}
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
