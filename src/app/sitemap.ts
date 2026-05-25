import { MetadataRoute } from "next";
import type { SanityDocument } from "@sanity/client";
import { urlFor } from "./api/client";
import {
  sitemapArticlesQuery,
  sitemapProductsQuery,
  sitemapProjectsQuery,
} from "./api/generateSanityQueries";
import { fetchPageData } from "./api/useFetchPage";
import { ICustomImage } from "@/components/reuse/SanityImage/SanityImage";

interface sitemapProductsQueryType extends SanityDocument {
  images: ICustomImage[];
}

async function getProductData() {
  const query = sitemapProductsQuery();
  const data: sitemapProductsQueryType[] = await fetchPageData(query);
  return data;
}

interface sitemapArticlesQueryType extends SanityDocument {
  customImage: ICustomImage;
}

async function getArticleData() {
  const query = sitemapArticlesQuery();
  const data: sitemapArticlesQueryType[] = await fetchPageData(query);
  return data;
}

interface sitemapProjectsQueryType extends SanityDocument {
  image: ICustomImage;
}

async function getProjectData(type: string) {
  const query = sitemapProjectsQuery(type);
  const data: sitemapProjectsQueryType[] = await fetchPageData(query);
  return data;
}

// Static URLs to include
const baseUrls = [
  "/",
  "/blog",
  "/contact",
  "/cart",
  "/legal/policies",
  "/boutique",
];

// Specific subpaths for `/course/*` and `/service/*`
const courseUrls = ["/course/in-person", "/course/online"];
const serviceUrls = [
  "/service/tattoo",
  "/service/henna",
  "/service/test-tattoo",
];

// Combine all static and subpath URLs into a single flat array
const allUrls = [...baseUrls, ...courseUrls, ...serviceUrls];
const SITE_URL = process.env.BASE_NAME || "https://www.adhennatattoo.com";
const locales = ["fr", "en"];

// Dynamic routes for portfolio
const dynamicRouteProjects = ["tattoo", "henna", "flash", "toiles"];

// Generate static entries for portfolio routes
const generateStaticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
  allUrls.map((baseUrl) => {
    const url = `${SITE_URL}/${locale}${baseUrl}`;

    return {
      url,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: locale === "fr" ? 1 : 0.8,
      alternates: {
        languages: {
          fr: `${SITE_URL}/fr${baseUrl}`,
          en: `${SITE_URL}/en${baseUrl}`,
          "x-default": `${SITE_URL}/fr${baseUrl}`,
        },
      },
    };
  }),
);

// Generate dynamic entries for portfolio routes
const generatePortfolioEntries = async (): Promise<MetadataRoute.Sitemap> => {
  const projectEntries: Promise<MetadataRoute.Sitemap> = Promise.all(
    locales.flatMap((locale) =>
      dynamicRouteProjects.map(async (projectType) => {
        const url = `${SITE_URL}/${locale}/portfolio/${projectType}`;
        const projectData = await getProjectData(projectType);

        return {
          url,
          lastModified: new Date().toISOString(),
          changeFrequency: "weekly",
          priority: locale === "fr" ? 0.6 : 0.5,
          images: projectData.map(
            (project) => urlFor(project.image.image).url() || "",
          ),
          alternates: {
            languages: {
              fr: `${SITE_URL}/fr/portfolio/${projectType}`,
              en: `${SITE_URL}/en/portfolio/${projectType}`,
              "x-default": `${SITE_URL}/fr/portfolio/${projectType}`,
            },
          },
        };
      }),
    ),
  );

  return projectEntries;
};
const generateDynamicEntries = async (): Promise<MetadataRoute.Sitemap> => {
  const productData = await getProductData();
  const articleData = await getArticleData();

  const productEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    productData.map((product: sitemapProductsQueryType) => {
      return {
        url: `${SITE_URL}/${locale}/boutique/${product.path}`,
        lastModified: product._updatedAt || new Date().toISOString(),
        changeFrequency: "weekly",
        priority: locale === "fr" ? 0.7 : 0.6,
        images: product.images.map((image) => urlFor(image.image).url()),
        alternates: {
          languages: {
            fr: `${SITE_URL}/fr/boutique/${product.path}`,
            en: `${SITE_URL}/en/boutique/${product.path}`,
            "x-default": `${SITE_URL}/fr/boutique/${product.path}`,
          },
        },
      };
    }),
  );

  const articleEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    articleData.map((article: sitemapArticlesQueryType) => {
      return {
        url: `${SITE_URL}/${locale}/blog/${article.path}`,
        lastModified: article._updatedAt || new Date().toISOString(),
        changeFrequency: "weekly",
        priority: locale === "fr" ? 0.6 : 0.5,
        images: [urlFor(article.customImage.image).url()],
        alternates: {
          languages: {
            fr: `${SITE_URL}/fr/blog/${article.path}`,
            en: `${SITE_URL}/en/blog/${article.path}`,
            "x-default": `${SITE_URL}/fr/blog/${article.path}`,
          },
        },
      };
    }),
  );

  return [...articleEntries, ...productEntries];
};

// Adapt the output to match the Next.js expected structure
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamicEntries = await generateDynamicEntries();
  const portfolioEntries = await generatePortfolioEntries();
  return [...generateStaticEntries, ...portfolioEntries, ...dynamicEntries];
}
