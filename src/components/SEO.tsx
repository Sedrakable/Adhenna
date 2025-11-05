import { Metadata } from "next";
import { LangType } from "@/i18n/request";
import dynamic from "next/dynamic";
import { ISeo } from "@/data.d";

interface SEOProps extends ISeo {
  locale: LangType;
  path: string;
  crawl?: boolean;
}

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
      url: `https://www.adhennatattoo.com/${locale}${path}`,
      type: "website",
      title: metaTitle,
      description: metaDesc,
      locale: locale,
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
      canonical: `https://www.adhennatattoo.com/${locale}${path}`,
      languages: {
        en: `https://www.adhennatattoo.com/en${path}`,
        fr: `https://www.adhennatattoo.com/fr${path}`,
        "x-default": `https://www.adhennatattoo.com/fr${path}`,
      },
    },
  };

  return metadata;
};
