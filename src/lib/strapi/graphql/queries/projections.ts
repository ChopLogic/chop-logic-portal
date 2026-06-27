export const LINK_PROJECTION = `
  id
  text
  url
  type
  platform
  target
  referrerpolicy
`;

export const IMAGE_PROJECTION = `
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

export const OPEN_GRAPH_PROJECTION = `
  ogTitle
  ogDescription
  ogType
  ogImage {
    ${IMAGE_PROJECTION}
  }
`;

export const METADATA_PROJECTION = `
  metaTitle
  metaDescription
  keywords
  authorName
  canonicalURL
  robots
  structuredData
  openGraph {
    ${OPEN_GRAPH_PROJECTION}
  }
`;

export const PARAGRAPH_PROJECTION = `
  __typename
  id
  heading
  subHeading
  content
  alignment
`;

export const CALL_TO_ACTION_PROJECTION = `
  __typename
  id
  heading
  subHeading
  picture {
    ${IMAGE_PROJECTION}
  }
  link {
    ${LINK_PROJECTION}
  }
`;

export const GALLERY_PROJECTION = `
  __typename
  id
  heading
  subHeading
  layout
  aspectRatio
  items {
    ${IMAGE_PROJECTION}
  }
`;

export const EMBEDDED_VIDEO_PROJECTION = `
  __typename
  id
  heading
  subHeading
  aspectRatio
  link {
    ${LINK_PROJECTION}
  }
`;

export const MEDIA_PROJECTION = `
  __typename
  id
  heading
  subHeading
  publicationDate
  aspectRatio
  item {
    ${IMAGE_PROJECTION}
  }
`;

export const TAG_PROJECTION = `
  documentId
  name
  description
  slug
  publishedAt
  updatedAt
  color
`;

export const REFERENCE_LIST_PROJECTION = `
  __typename
  id
  heading
  subHeading
  links {
    ${LINK_PROJECTION}
  }
`;

export const ARTICLE_SUMMARY_PROJECTION = `
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
`;
