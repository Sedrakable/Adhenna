import { Metadata } from "next";
import { LangType } from "@/i18n/request";
import { ISeo } from "@/data.d";

interface SEOProps extends ISeo {
  locale: LangType;
  path: string;
  crawl?: boolean;
}

const SITE_URL = process.env.BASE_NAME || "https://www.adhennatattoo.com";
const localeMap: Record<LangType, string> = {
  fr: "fr_CA",
  en: "en_CA",
};

export const setMetadata = ({
  locale,
  metaTitle,
  metaDesc,
  path,
  crawl,
}: SEOProps): Metadata => {
  const metadata: Metadata = {
    title: metaTitle,
    description: metaDesc,
    robots: {
      index: crawl,
      follow: crawl,
    },
    openGraph: {
      url: `${SITE_URL}/${locale}${path}`,
      type: "website",
      title: metaTitle,
      description: metaDesc,
      locale: localeMap[locale],
      alternateLocale: [locale === "fr" ? localeMap.en : localeMap.fr],
      siteName: "ADHENNA TATTOO",
      images: [
        {
          url: "https://i.imgur.com/XsJPXnO.jpeg",
          width: 1050,
          height: 600,
          alt: "Adhenna Tattoo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDesc,
      site: "@AdhennaTattoo",
      images: [
        {
          url: "https://i.imgur.com/XsJPXnO.jpeg",
          width: 1200,
          height: 630,
          alt: "Adhenna Tattoo",
        },
      ],
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}${path}`,
      languages: {
        fr: `${SITE_URL}/fr${path}`,
        en: `${SITE_URL}/en${path}`,
        "x-default": `${SITE_URL}/fr${path}`,
      },
    },
  };

  return metadata;
};
