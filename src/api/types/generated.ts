/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export enum ENUM_COMPONENTSECTIONSGALLERY_LAYOUT {
  carousel = 'carousel',
  grid = 'grid',
  masonry = 'masonry'
}

export enum ENUM_COMPONENTSECTIONSLINK_PLATFORM {
  Discord = 'Discord',
  Facebook = 'Facebook',
  GitHub = 'GitHub',
  Instagram = 'Instagram',
  LinkedIn = 'LinkedIn',
  Medium = 'Medium',
  Pinterest = 'Pinterest',
  Reddit = 'Reddit',
  Telegram = 'Telegram',
  TikTok = 'TikTok',
  WhatsApp = 'WhatsApp',
  X_Twitter = 'X_Twitter',
  YouTube = 'YouTube'
}

export enum ENUM_COMPONENTSECTIONSLINK_REFERRERPOLICY {
  no_referrer = 'no_referrer',
  no_referrer_when_downgrade = 'no_referrer_when_downgrade',
  origin = 'origin',
  origin_when_cross_origin = 'origin_when_cross_origin',
  same_origin = 'same_origin',
  strict_origin = 'strict_origin',
  strict_origin_when_cross_origin = 'strict_origin_when_cross_origin',
  unsafe_url = 'unsafe_url'
}

export enum ENUM_COMPONENTSECTIONSLINK_TARGET {
  blank = 'blank',
  parent = 'parent',
  self = 'self',
  top = 'top'
}

export enum ENUM_COMPONENTSECTIONSLINK_TYPE {
  external = 'external',
  internal = 'internal'
}

export enum ENUM_COMPONENTSECTIONSPARAGRAPH_ALIGNMENT {
  center = 'center',
  left = 'left',
  right = 'right'
}

export enum ENUM_COMPONENTSHAREDOPENGRAPH_OGTYPE {
  article = 'article',
  website = 'website'
}

export type ImageFields = {
  __typename: 'UploadFile',
  url: string,
  name: string,
  mime: string,
  documentId: string,
  alternativeText: string | null,
  caption: string | null,
  width: number | null,
  height: number | null,
  previewUrl: string | null,
  size: number,
  formats: any,
  focalPoint: any
};

export type LinkFields = {
  __typename: 'ComponentSectionsLink',
  id: string,
  platform: ENUM_COMPONENTSECTIONSLINK_PLATFORM | null,
  url: string,
  text: string,
  target: ENUM_COMPONENTSECTIONSLINK_TARGET | null,
  referrerpolicy: ENUM_COMPONENTSECTIONSLINK_REFERRERPOLICY | null,
  type: ENUM_COMPONENTSECTIONSLINK_TYPE
};

export type OpenGraphFields_ogImage = {
  __typename: 'UploadFile',
  url: string,
  name: string,
  mime: string,
  documentId: string,
  alternativeText: string | null,
  caption: string | null,
  width: number | null,
  height: number | null,
  previewUrl: string | null,
  size: number,
  formats: any,
  focalPoint: any
};

export type OpenGraphFields = {
  __typename: 'ComponentSharedOpenGraph',
  ogTitle: string | null,
  ogDescription: string | null,
  ogType: ENUM_COMPONENTSHAREDOPENGRAPH_OGTYPE | null,
  ogImage: OpenGraphFields_ogImage | null
};

export type MetaDataFields_openGraph = {
  __typename: 'ComponentSharedOpenGraph',
  ogTitle: string | null,
  ogDescription: string | null,
  ogType: ENUM_COMPONENTSHAREDOPENGRAPH_OGTYPE | null,
  ogImage: OpenGraphFields_ogImage | null
};

export type MetaDataFields = {
  __typename: 'ComponentSharedSeo',
  authorName: string | null,
  canonicalURL: string | null,
  keywords: string | null,
  metaDescription: string,
  metaTitle: string,
  robots: string | null,
  structuredData: any,
  openGraph: MetaDataFields_openGraph | null
};

export type GetAboutMePage_aboutMe_metaData = {
  __typename: 'ComponentSharedSeo',
  authorName: string | null,
  canonicalURL: string | null,
  keywords: string | null,
  metaDescription: string,
  metaTitle: string,
  robots: string | null,
  structuredData: any,
  openGraph: MetaDataFields_openGraph | null
};

export type GetAboutMePage_aboutMe_content_link = {
  __typename: 'ComponentSectionsLink',
  id: string,
  platform: ENUM_COMPONENTSECTIONSLINK_PLATFORM | null,
  url: string,
  text: string,
  target: ENUM_COMPONENTSECTIONSLINK_TARGET | null,
  referrerpolicy: ENUM_COMPONENTSECTIONSLINK_REFERRERPOLICY | null,
  type: ENUM_COMPONENTSECTIONSLINK_TYPE
};

export type GetAboutMePage_aboutMe_content_picture = {
  __typename: 'UploadFile',
  url: string,
  name: string,
  mime: string,
  documentId: string,
  alternativeText: string | null,
  caption: string | null,
  width: number | null,
  height: number | null,
  previewUrl: string | null,
  size: number,
  formats: any,
  focalPoint: any
};

export type GetAboutMePage_aboutMe_content_ComponentSectionsEmbeddedVideo_link = {
  __typename: 'ComponentSectionsLink',
  id: string,
  platform: ENUM_COMPONENTSECTIONSLINK_PLATFORM | null,
  url: string,
  text: string,
  target: ENUM_COMPONENTSECTIONSLINK_TARGET | null,
  referrerpolicy: ENUM_COMPONENTSECTIONSLINK_REFERRERPOLICY | null,
  type: ENUM_COMPONENTSECTIONSLINK_TYPE
};

export type GetAboutMePage_aboutMe_content_ComponentSectionsGallery_items = {
  __typename: 'UploadFile',
  url: string,
  name: string,
  mime: string,
  documentId: string,
  alternativeText: string | null,
  caption: string | null,
  width: number | null,
  height: number | null,
  previewUrl: string | null,
  size: number,
  formats: any,
  focalPoint: any
};

export type GetAboutMePage_aboutMe_content_ComponentSectionsMedia_item = {
  __typename: 'UploadFile',
  url: string,
  name: string,
  mime: string,
  documentId: string,
  alternativeText: string | null,
  caption: string | null,
  width: number | null,
  height: number | null,
  previewUrl: string | null,
  size: number,
  formats: any,
  focalPoint: any
};

export type GetAboutMePage_aboutMe_content_ComponentSectionsCallToAction = {
  __typename: 'ComponentSectionsCallToAction',
  id: string,
  heading: string,
  subHeading: string | null,
  link: GetAboutMePage_aboutMe_content_link,
  picture: GetAboutMePage_aboutMe_content_picture | null
};

export type GetAboutMePage_aboutMe_content_ComponentSectionsEmbeddedVideo = {
  __typename: 'ComponentSectionsEmbeddedVideo',
  id: string,
  heading: string,
  subHeading: string | null,
  aspectRatio: string | null,
  link: GetAboutMePage_aboutMe_content_ComponentSectionsEmbeddedVideo_link
};

export type GetAboutMePage_aboutMe_content_ComponentSectionsGallery = {
  __typename: 'ComponentSectionsGallery',
  id: string,
  heading: string,
  subHeading: string | null,
  layout: ENUM_COMPONENTSECTIONSGALLERY_LAYOUT | null,
  aspectRatio: string | null,
  items: Array<GetAboutMePage_aboutMe_content_ComponentSectionsGallery_items | null>
};

export type GetAboutMePage_aboutMe_content_ComponentSectionsMedia = {
  __typename: 'ComponentSectionsMedia',
  id: string,
  heading: string,
  subHeading: string | null,
  aspectRatio: string | null,
  publicationDate: any,
  item: GetAboutMePage_aboutMe_content_ComponentSectionsMedia_item
};

export type GetAboutMePage_aboutMe_content_ComponentSectionsParagraph = {
  __typename: 'ComponentSectionsParagraph',
  id: string,
  heading: string,
  subHeading: string | null,
  alignment: ENUM_COMPONENTSECTIONSPARAGRAPH_ALIGNMENT,
  content: any
};

export type GetAboutMePage_aboutMe_content_Error = {
  __typename: 'Error'
};

export type GetAboutMePage_aboutMe_content =
  | GetAboutMePage_aboutMe_content_ComponentSectionsCallToAction
  | GetAboutMePage_aboutMe_content_ComponentSectionsEmbeddedVideo
  | GetAboutMePage_aboutMe_content_ComponentSectionsGallery
  | GetAboutMePage_aboutMe_content_ComponentSectionsMedia
  | GetAboutMePage_aboutMe_content_ComponentSectionsParagraph
  | GetAboutMePage_aboutMe_content_Error
;

export type GetAboutMePage_aboutMe = {
  __typename: 'AboutMe',
  documentId: string,
  slug: string,
  title: string,
  subTitle: string | null,
  publishedAt: any,
  updatedAt: any,
  metaData: GetAboutMePage_aboutMe_metaData,
  content: Array<GetAboutMePage_aboutMe_content | null>
};

export type GetAboutMePage = {
  aboutMe: GetAboutMePage_aboutMe | null
};


export type GetAboutMePageVariables = Exact<{ [key: string]: never; }>;

export type GetHomePage_home_content_link = {
  __typename: 'ComponentSectionsLink',
  id: string,
  platform: ENUM_COMPONENTSECTIONSLINK_PLATFORM | null,
  url: string,
  text: string,
  target: ENUM_COMPONENTSECTIONSLINK_TARGET | null,
  referrerpolicy: ENUM_COMPONENTSECTIONSLINK_REFERRERPOLICY | null,
  type: ENUM_COMPONENTSECTIONSLINK_TYPE
};

export type GetHomePage_home_content_picture = {
  __typename: 'UploadFile',
  url: string,
  name: string,
  mime: string,
  documentId: string,
  alternativeText: string | null,
  caption: string | null,
  width: number | null,
  height: number | null,
  previewUrl: string | null,
  size: number,
  formats: any,
  focalPoint: any
};

export type GetHomePage_home_content_ComponentSectionsEmbeddedVideo_link = {
  __typename: 'ComponentSectionsLink',
  id: string,
  platform: ENUM_COMPONENTSECTIONSLINK_PLATFORM | null,
  url: string,
  text: string,
  target: ENUM_COMPONENTSECTIONSLINK_TARGET | null,
  referrerpolicy: ENUM_COMPONENTSECTIONSLINK_REFERRERPOLICY | null,
  type: ENUM_COMPONENTSECTIONSLINK_TYPE
};

export type GetHomePage_home_content_ComponentSectionsGallery_items = {
  __typename: 'UploadFile',
  url: string,
  name: string,
  mime: string,
  documentId: string,
  alternativeText: string | null,
  caption: string | null,
  width: number | null,
  height: number | null,
  previewUrl: string | null,
  size: number,
  formats: any,
  focalPoint: any
};

export type GetHomePage_home_content_ComponentSectionsMedia_item = {
  __typename: 'UploadFile',
  url: string,
  name: string,
  mime: string,
  documentId: string,
  alternativeText: string | null,
  caption: string | null,
  width: number | null,
  height: number | null,
  previewUrl: string | null,
  size: number,
  formats: any,
  focalPoint: any
};

export type GetHomePage_home_content_ComponentSectionsCallToAction = {
  __typename: 'ComponentSectionsCallToAction',
  id: string,
  heading: string,
  subHeading: string | null,
  link: GetHomePage_home_content_link,
  picture: GetHomePage_home_content_picture | null
};

export type GetHomePage_home_content_ComponentSectionsEmbeddedVideo = {
  __typename: 'ComponentSectionsEmbeddedVideo',
  id: string,
  heading: string,
  subHeading: string | null,
  aspectRatio: string | null,
  link: GetHomePage_home_content_ComponentSectionsEmbeddedVideo_link
};

export type GetHomePage_home_content_ComponentSectionsGallery = {
  __typename: 'ComponentSectionsGallery',
  id: string,
  heading: string,
  subHeading: string | null,
  layout: ENUM_COMPONENTSECTIONSGALLERY_LAYOUT | null,
  aspectRatio: string | null,
  items: Array<GetHomePage_home_content_ComponentSectionsGallery_items | null>
};

export type GetHomePage_home_content_ComponentSectionsMedia = {
  __typename: 'ComponentSectionsMedia',
  id: string,
  heading: string,
  subHeading: string | null,
  aspectRatio: string | null,
  publicationDate: any,
  item: GetHomePage_home_content_ComponentSectionsMedia_item
};

export type GetHomePage_home_content_ComponentSectionsParagraph = {
  __typename: 'ComponentSectionsParagraph',
  id: string,
  heading: string,
  subHeading: string | null,
  alignment: ENUM_COMPONENTSECTIONSPARAGRAPH_ALIGNMENT,
  content: any
};

export type GetHomePage_home_content_Error = {
  __typename: 'Error'
};

export type GetHomePage_home_content =
  | GetHomePage_home_content_ComponentSectionsCallToAction
  | GetHomePage_home_content_ComponentSectionsEmbeddedVideo
  | GetHomePage_home_content_ComponentSectionsGallery
  | GetHomePage_home_content_ComponentSectionsMedia
  | GetHomePage_home_content_ComponentSectionsParagraph
  | GetHomePage_home_content_Error
;

export type GetHomePage_home = {
  __typename: 'Home',
  documentId: string,
  slug: string,
  title: string,
  subTitle: string | null,
  publishedAt: any,
  updatedAt: any,
  content: Array<GetHomePage_home_content | null>
};

export type GetHomePage = {
  home: GetHomePage_home | null
};


export type GetHomePageVariables = Exact<{ [key: string]: never; }>;
