export const LINK_FRAGMENT = `
  id
  text
  url
  type
  platform
  target
  referrerpolicy
`;

export const IMAGE_FRAGMENT = `
  documentId
  name
  alternativeText
  caption
  focalPoint
  width
  height
  formats
  size
  url
  previewUrl
  updatedAt
`;

export const OPEN_GRAPH_FRAGMENT = `
  ogTitle
  ogDescription
  ogType
  ogImage {
    ${IMAGE_FRAGMENT}
  }
`;

export const METADATA_FRAGMENT = `
  metaTitle
  metaDescription
  keywords
  authorName
  canonicalURL
  robots
  structuredData
  openGraph {
    ${OPEN_GRAPH_FRAGMENT}
  }
`;

export const PARAGRAPH_FRAGMENT = `
  __typename
  id
  heading
  subHeading
  content
  alignment
`;

export const CALL_TO_ACTION_FRAGMENT = `
  __typename
  id
  heading
  subHeading
  picture {
    ${IMAGE_FRAGMENT}
  }
  link {
    ${LINK_FRAGMENT}
  }
`;

export const GALLERY_FRAGMENT = `
  __typename
  id
  heading
  subHeading
  layout
  aspectRatio
  items {
    ${IMAGE_FRAGMENT}
  }
`;

export const EMBEDDED_VIDEO_FRAGMENT = `
  __typename
  id
  heading
  subHeading
  aspectRatio
  link {
    ${LINK_FRAGMENT}
  }
`;

export const MEDIA_FRAGMENT = `
  __typename
  id
  heading
  subHeading
  publicationDate
  aspectRatio
  item {
    ${IMAGE_FRAGMENT}
  }
`;

export const TAG_FRAGMENT = `
  documentId
  name
  description
  slug
  publishedAt
  updatedAt
  color
`;

export const REFERENCE_LIST_FRAGMENT = `
  __typename
  id
  heading
  subHeading
  links {
    ${LINK_FRAGMENT}
  }
`;

export const ARTICLE_SUMMARY_FRAGMENT = `
  documentId
  title
  subTitle
  slug
  publicationDate
  updatedAt
  excerpt
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
      role
      avatar {
        ${IMAGE_FRAGMENT}
      }
    }
  }
`;

export const CONFIG_FRAGMENT = `
  documentId
  title
  description
  links {
    ${LINK_FRAGMENT}
  }
  footer
  logo {
    ${IMAGE_FRAGMENT}
  }
  updatedAt
`;

export const ARTICLE_CONTENT_FRAGMENT = `
  ... on ComponentSectionsParagraph {
    ${PARAGRAPH_FRAGMENT}
  }
  ... on ComponentSectionsGallery {
    ${GALLERY_FRAGMENT}
  }
  ... on ComponentSectionsEmbeddedVideo {
    ${EMBEDDED_VIDEO_FRAGMENT}
  }
  ... on ComponentSectionsCallToAction {
    ${CALL_TO_ACTION_FRAGMENT}
  }
  ... on ComponentSectionsMedia {
    ${MEDIA_FRAGMENT}
  }
  ... on ComponentSectionsReferenceList {
    ${REFERENCE_LIST_FRAGMENT}
  }
`;
