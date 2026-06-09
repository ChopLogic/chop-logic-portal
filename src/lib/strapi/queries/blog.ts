import {
	CALL_TO_ACTION_PROJECTION,
	IMAGE_PROJECTION,
	LINK_PROJECTION,
	MEDIA_PROJECTION,
	METADATA_PROJECTION,
	PARAGRAPH_PROJECTION,
	TAG_PROJECTION,
} from "./projections";

export const BLOG_PAGE_QUERY = /* GraphQL */ `
  query FetchBlogPage {
    blog {
        documentId
        updatedAt
        title
        subTitle
        slug
        content {
            ... on ComponentSectionsParagraph {
            ${PARAGRAPH_PROJECTION}
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
    articles(sort: ["publicationDate:desc"], pagination: { limit: 100 }) {
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
