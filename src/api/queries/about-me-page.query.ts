import { gql } from "graphql-request";
import {
	CONFIG_FRAGMENT,
	DYNAMIC_CONTENT_FRAGMENT,
	METADATA_FRAGMENT,
} from "./fragments";

export const ABOUT_ME_PAGE_QUERY = gql`
  query AboutMePage {
    aboutMe {
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
