import { IMAGE_PROJECTION, LINK_PROJECTION } from "./projections";

export const CONFIG_QUERY = /* GraphQL */ `
    query FetchConfig {
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
