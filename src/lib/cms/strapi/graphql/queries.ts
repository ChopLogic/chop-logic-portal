const linkFields = `
  id
  text
  url
  type
  platform
  target
  referrerpolicy
`;

const mediaFields = `
  url
  alternativeText
  name
`;

const seoFields = `
  metaTitle
  metaDescription
  keywords
  canonicalURL
  authorName
  robots
  structuredData
  openGraph {
    ogTitle
    ogDescription
    ogType
  }
`;

/** Dynamic zone selections for `Article.content` (`ArticleContentDynamicZone`). */
const articleDynamicZone = `
  __typename
  ... on ComponentSectionsParagraph {
    heading
    alignment
    text
  }
  ... on ComponentSectionsPicture {
    altText
    caption
    pictureImage: image {
      ${mediaFields}
    }
  }
  ... on ComponentSectionsCallToAction {
    heading
    subheading
    link {
      ${linkFields}
    }
    image {
      altText
      caption
      image {
        ${mediaFields}
      }
    }
  }
  ... on ComponentSectionsReferenceList {
    heading
    links {
      ${linkFields}
    }
  }
  ... on ComponentSectionsEmbeddedVideo {
    heading
    platform
    link {
      ${linkFields}
    }
  }
  ... on ComponentSectionsGallery {
    heading
    layout
    images {
      altText
      caption
      image {
        ${mediaFields}
      }
    }
  }
  ... on ComponentSectionsInternalVideo {
    heading
    file {
      ${mediaFields}
    }
  }
`;

/** Dynamic zone for `Home.content` (`HomeContentDynamicZone`). */
const homeDynamicZone = `
  __typename
  ... on ComponentSectionsParagraph {
    heading
    alignment
    text
  }
  ... on ComponentSectionsPicture {
    altText
    caption
    pictureImage: image {
      ${mediaFields}
    }
  }
  ... on ComponentSectionsCallToAction {
    heading
    subheading
    link {
      ${linkFields}
    }
    pictureImage: image {
      ${mediaFields}
    }
  }
  ... on ComponentSectionsEmbeddedVideo {
    heading
    platform
    link {
      ${linkFields}
    }
  }
  ... on ComponentSectionsGallery {
    heading
    layout
    images {
      altText
      caption
      image {
      ${mediaFields}
    }
    }
  }
  ... on ComponentSectionsInternalVideo {
    heading
    file
  }
`;

/** Dynamic zone for `AboutMe.content` (`AboutMeContentDynamicZone`). */
const aboutMeDynamicZone = `
  __typename
  ... on ComponentSectionsParagraph {
    heading
    alignment
    text
  }
  ... on ComponentSectionsPicture {
    altText
    caption
    pictureImage: image {
      ${mediaFields}
    }
  }
  ... on ComponentSectionsCallToAction {
    heading
    subheading
    link {
      ${linkFields}
    }
    image {
      altText
      caption
      image {
        ${mediaFields}
      }
    }
  }
  ... on ComponentSectionsEmbeddedVideo {
    heading
    platform
    link {
      ${linkFields}
    }
  }
  ... on ComponentSectionsGallery {
    heading
    layout
    images {
      altText
      caption
      image {
        ${mediaFields}
      }
    }
  }
  ... on ComponentSectionsInternalVideo {
    heading
    file {
      ${mediaFields}
    }
  }
`;

export const ARTICLE_LIST_QUERY = /* GraphQL */ `
  query ArticleList {
    articles(
      status: PUBLISHED
      sort: ["publicationDate:desc"]
      pagination: { limit: 100 }
    ) {
      documentId
      title
      slug
      publicationDate
      updatedAt
      publishedAt
      summary
      preview {
        ${mediaFields}
      }
      metaData {
        ${seoFields}
      }
      authors {
        documentId
      }
    }
  }
`;

export const ARTICLE_BY_SLUG_QUERY = /* GraphQL */ `
  query ArticleBySlug($slug: String!) {
    articles(
      status: PUBLISHED
      filters: { slug: { eq: $slug } }
      pagination: { limit: 1 }
    ) {
      documentId
      title
      slug
      publicationDate
      updatedAt
      publishedAt
      summary
      preview {
        ${mediaFields}
      }
      metaData {
        ${seoFields}
      }
      authors {
        documentId
      }
      content {
        ${articleDynamicZone}
      }
    }
  }
`;

export const HOME_QUERY = /* GraphQL */ `
  query HomePage {
    home(status: PUBLISHED) {
      documentId
      title
      slug
      heading
      subHeading
      publishedAt
      updatedAt
      metaData {
        ${seoFields}
      }
      content {
        ${homeDynamicZone}
      }
    }
  }
`;

export const ABOUT_ME_QUERY = /* GraphQL */ `
  query AboutMePage {
    aboutMe(status: PUBLISHED) {
      documentId
      title
      slug
      heading
      subHeading
      publishedAt
      updatedAt
      metaData {
        ${seoFields}
      }
      heroImage {
        altText
        caption
        image {
          ${mediaFields}
        }
      }
      content {
        ${aboutMeDynamicZone}
      }
    }
  }
`;

export const SITE_CONFIG_QUERY = /* GraphQL */ `
  query SiteConfig {
    config(status: PUBLISHED) {
      documentId
      siteTitle
      footerText
      links {
        ${linkFields}
      }
    }
  }
`;
