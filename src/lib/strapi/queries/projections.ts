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
  items {
    ${IMAGE_PROJECTION}
  }
`;

export const EMBEDDED_VIDEO_PROJECTION = `
  __typename
  id
  heading
  subHeading
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
