import { LangType } from "@/i18n/request";

// ============================================
// HELPER FUNCTION
// ============================================

/**
 * Creates a GROQ query with locale fallback to French
 * @param pageType - The Sanity document type
 * @param locale - The desired locale
 * @param fields - The fields to project (without the surrounding braces)
 */
const pageQuery = (
  pageType: string,
  locale: LangType,
  fields: string
): string => `
*[_type == "${pageType}" && lang == '${locale}'][0]{${fields}}
`;

// ============================================
// NON-LOCALE QUERIES (unchanged)
// ============================================

export const socialsQuery = (): string => {
  return `*[_type == 'socials'][0]`;
};

export const hoursQuery = (): string => {
  return `*[_type == 'openingHours'][0]`;
};

export const carouselQuery = (workType: string | undefined): string => {
  return `*[_type == 'work' ${workType ? `&& workType == '${workType}'` : ""}] {
    projects[]->
  }`;
};

export const projectPageQuery = (type: string, id: string): string => {
  return `*[_type == '${type}Project' && slug.current == '${id}'][0]`;
};

export const sitemapProductsQuery = (): string => {
  return `*[_type == 'product']{
  path,
  images,
  _updatedAt,
  }`;
};

export const sitemapArticlesQuery = (): string => {
  return `*[_type == 'articlePage']{
  path,
  customImage,
  _updatedAt,
  }`;
};

export const sitemapProjectsQuery = (type: string): string => {
  return `*[_type == '${type}Project']{
  image,
  }`;
};

// ============================================
// LOCALE-BASED QUERIES (refactored)
// ============================================

export const homePageQuery = (locale: LangType): string =>
  pageQuery(
    "homePage",
    locale,
    `
  meta,
  homeHero->,
  services[]->,
  works[]->{
    path,
    reserve,
    hero{title, backgroundImage}
  },
  history->,
  reviews,
  bigCTA->
`
  );

export const portfolioPageQuery = (locale: LangType): string =>
  pageQuery(
    "portfolioPage",
    locale,
    `
  meta,
  hero,
  works[]->{
    path,
    reserve,
    hero{
      title,
      backgroundImage,
    },
  },
  history->,
`
  );

export const workPageQuery = (path: string, locale: LangType): string => {
  return `coalesce(
  *[_type == 'workPage' && lang == '${locale}' && path == '/${path}'][0],
  *[_type == 'workPage' && lang == 'fr' && path == '/${path}'][0]
){
    meta,
    hero,
    work->{
      ...,
      projects[]->
    },
  }`;
};

export const tattooServicePageQuery = (locale: LangType): string =>
  pageQuery(
    "tattooServicePage",
    locale,
    `
  meta,
  hero,
  tarifText,
  pricePlans[],
  multiDescriptions[],
  collapsible->,
`
  );

export const hennaServicePageQuery = (locale: LangType): string =>
  pageQuery(
    "hennaServicePage",
    locale,
    `
  meta,
  hero,
  tarifText,
  pricePlans[],
  multiDescriptions[],
`
  );

export const testTattooServicePageQuery = (locale: LangType): string =>
  pageQuery(
    "testTattooServicePage",
    locale,
    `
  meta,
  hero,
  display,
  desc,
  pricePlans[],
  bigCTA->,
`
  );

export const inPersonCoursePageQuery = (locale: LangType): string =>
  pageQuery(
    "inPersonCoursePage",
    locale,
    `
  meta,
  hero,
  infoText,
  multiDescriptions[],
  image,
  pricePlans1[],
  experienceText,
  pricePlans2[],
  bigCTA->
`
  );

export const onlineCoursePageQuery = (locale: LangType): string =>
  pageQuery(
    "onlineCoursePage",
    locale,
    `
  meta,
  hero,
  desc,
  pricePlan,
  video {
    videoFile {
      asset->{
        url,
        mimeType
      }
    },
    externalVideo,
    caption,
    thumbnail,
  },
  features[],
`
  );

export const cartPageQuery = (locale: LangType): string =>
  pageQuery(
    "cartPage",
    locale,
    `
  meta,
  hero,
  collapsible->,
`
  );

export const formQuery = (slug: string, locale: LangType): string =>
  pageQuery(`${slug}Form`, locale, `...`);

export const boutiquePageQuery = (locale: LangType): string =>
  pageQuery(
    "boutiquePage",
    locale,
    `
  meta,
  hero,
  displays[]->,
  desc,
  products[]->,
`
  );

export const productQuery = (locale: LangType, path: string): string => {
  return `*[_type == 'product' && lang == '${locale}' && path == '${path}'][0]{
  ...,
  collapsible->,
  }`;
};

export const blogPageQuery = (locale: LangType): string =>
  pageQuery(
    "blogPage",
    locale,
    `
  meta,
  blog->{
    articles[]->{
      path,
      title,
      desc,
      date,
      type,
      customImage
    }
  }
`
  );

export const articlesOrderQuery = (locale: LangType): string => {
  return `*[_type == 'articlePage' && lang == '${locale}']{
    path,
    title,
}`;
};

export const articlePageQuery = (locale: LangType, slug: string): string => {
  return `*[_type == 'articlePage' && lang == '${locale}' && path == '${slug}'][0]{
    ...,
    meta,
  }`;
};

export const contactPageQuery = (locale: LangType): string =>
  pageQuery(
    "contactPage",
    locale,
    `
  meta,
  hero,
  collapsible->,
`
  );

export const pricePlansQuery = (pageType: string, locale: LangType): string =>
  pageQuery(
    pageType,
    locale,
    `
  pricePlans[],
  pricePlans1[],
  pricePlans2[],
`
  );

export const legalPageQuery = (locale: LangType, slug: string): string => {
  return `*[_type == 'legalPage' && lang == '${locale}' && path == '${slug}'][0]`;
};

export const policiesPageQuery = (locale: LangType): string =>
  pageQuery(
    "policiesPage",
    locale,
    `
  collapsibles[]->,
`
  );

export const notFoundPageQuery = (locale: LangType): string =>
  pageQuery("notFoundPage", locale, `...`);
