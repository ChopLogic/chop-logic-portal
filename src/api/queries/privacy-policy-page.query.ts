import { gql } from "graphql-request";
import {
	CONFIG_FRAGMENT,
	DYNAMIC_CONTENT_FRAGMENT,
	METADATA_FRAGMENT,
} from "./fragments";

export const PRIVACY_POLICY_PAGE_QUERY = gql`
  query PrivacyPolicyPage {
    privacyPolicy {
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
    config {
      ${CONFIG_FRAGMENT}
    }
  }
`;
