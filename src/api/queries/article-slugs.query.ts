import { gql } from "graphql-request";

export const ARTICLE_SLUGS_QUERY = gql`
    query ArticleSlugs {
        articles {
            slug
            documentId
        }
}
`;
