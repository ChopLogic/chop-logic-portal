import { LINK_PROJECTION } from "./projections";

export const AUTHORS_QUERY = /* GraphQL */ `
    query FetchAllAuthors {
        authors {
            documentId
            name
            email
            role
            slug
            createdAt
            updatedAt
            bio
            socialLinks {
                ${LINK_PROJECTION}
            }
        }
    }
`;
