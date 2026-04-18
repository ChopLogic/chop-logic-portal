import {
	CALL_TO_ACTION_PROJECTION,
	MEDIA_PROJECTION,
	METADATA_PROJECTION,
	PARAGRAPH_PROJECTION,
} from "./projections";

export const BLOG_QUERY = /* GraphQL */ `
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
  }
`;
