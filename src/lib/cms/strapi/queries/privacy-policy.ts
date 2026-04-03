import { METADATA_PROJECTION } from "./projections";

export const PRIVACY_POLICY_QUERY = /* GraphQL */ `
  query FetchPrivacyPolicyPage {
    privacyPolicy {
        documentId
        updatedAt
        title
        subTitle
        slug
        content
        metaData {
            ${METADATA_PROJECTION}
        }
    }
  }
`;
