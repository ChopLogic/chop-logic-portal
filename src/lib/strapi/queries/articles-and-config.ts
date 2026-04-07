import {
	IMAGE_PROJECTION,
	LINK_PROJECTION,
	METADATA_PROJECTION,
	TAG_PROJECTION,
} from "./projections";

/** Article list plus global config in one request (blog index, RSS, slug static paths). */
export const ARTICLES_AND_CONFIG_QUERY = /* GraphQL */ `
  query FetchArticlesAndConfig {
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
