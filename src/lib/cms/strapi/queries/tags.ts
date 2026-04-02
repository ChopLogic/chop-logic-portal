import { TAG_PROJECTION } from "./projections";

export const TAGS_QUERY = /* GraphQL */ `
    query FetchAllTags {
        tags {
            ${TAG_PROJECTION}
        }
    }
`;
