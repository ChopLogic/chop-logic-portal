import { gql } from "graphql-request";
import {
	ARTICLE_CONTENT_FRAGMENT,
	CONFIG_FRAGMENT,
	IMAGE_FRAGMENT,
	METADATA_FRAGMENT,
	TAG_FRAGMENT,
} from "./fragments";

export const ARTICLE_PAGE_BY_SLUG_QUERY = gql`
  query ArticlePageBySlug($slug: String!) {
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
      excerpt
      summary
      preview {
        ${IMAGE_FRAGMENT}
      }
      tags {
        ${TAG_FRAGMENT}
      }
      authors_connection {
        nodes {
          name
          email
          documentId
        }
      }
      content {
        ${ARTICLE_CONTENT_FRAGMENT}
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
