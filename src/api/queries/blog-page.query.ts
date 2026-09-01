import { gql } from "graphql-request";
import {
	ARTICLE_SUMMARY_FRAGMENT,
	DYNAMIC_CONTENT_FRAGMENT,
	IMAGE_FRAGMENT,
	LINK_FRAGMENT,
	METADATA_FRAGMENT,
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
          ${DYNAMIC_CONTENT_FRAGMENT}
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
