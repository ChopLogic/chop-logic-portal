import {
	CALL_TO_ACTION_PROJECTION,
	EMBEDDED_VIDEO_PROJECTION,
	GALLERY_PROJECTION,
	IMAGE_PROJECTION,
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

/** List view: no dynamic zone body — avoids loading full article content for every row. */
export const ARTICLES_LIST_QUERY = /* GraphQL */ `
query FetchArticlesList {
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
}
`;

export const ARTICLE_BY_SLUG_QUERY = /* GraphQL */ `
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
}
`;

/** Full projection (e.g. tests / tooling); prefer ARTICLES_LIST_QUERY + ARTICLE_BY_SLUG_QUERY in production. */
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
}
`;
