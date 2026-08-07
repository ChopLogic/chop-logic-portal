import { gql } from "graphql-request";
import {
	ARTICLE_SUMMARY_FRAGMENT,
	CALL_TO_ACTION_FRAGMENT,
	IMAGE_FRAGMENT,
	LINK_FRAGMENT,
	MEDIA_FRAGMENT,
	METADATA_FRAGMENT,
	PARAGRAPH_FRAGMENT,
} from "./fragments";

export const BLOG_PAGE_QUERY = gql`
  query BlogPage {
    blog {
        documentId
        updatedAt
        title
        subTitle
        slug
        content {
            ... on ComponentSectionsParagraph {
            ${PARAGRAPH_FRAGMENT}
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
    articles(sort: ["publicationDate:desc"], pagination: { limit: 100 }) {
      ${ARTICLE_SUMMARY_FRAGMENT}
    }
    config {
      documentId
      title
      description
      links {
        ${LINK_FRAGMENT}
      }
      footer
      logo {
        ${IMAGE_FRAGMENT}
      }
      updatedAt
    }
  }
`;
