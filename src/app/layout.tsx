import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Metadata } from "next";

const SITE_URL = process.env.BASE_NAME || "https://www.adhennatattoo.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ADHENNA TATTOO | Tatouages et henné à Verdun, Montréal",
  description:
    "Studio de tatouage et de henné à Verdun, Montréal. Tatouages personnalisés, henné naturel, cours en ligne et en personne.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "fr_CA",
    alternateLocale: ["en_CA"],
    url: `${SITE_URL}/fr`,
    siteName: "ADHENNA TATTOO",
    title: "ADHENNA TATTOO | Tatouages et henné à Verdun, Montréal",
    description:
      "Studio de tatouage et de henné à Verdun, Montréal. Tatouages personnalisés, henné naturel, cours en ligne et en personne.",
    images: [
      {
        url: "https://i.imgur.com/XsJPXnO.jpeg",
        width: 1050,
        height: 600,
        alt: "Adhenna Tattoo Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@AdhennaTattoo",
    title: "ADHENNA TATTOO | Tatouages et henné à Verdun, Montréal",
    description:
      "Studio de tatouage et de henné à Verdun, Montréal. Tatouages personnalisés, henné naturel et cours.",
    images: ["https://i.imgur.com/XsJPXnO.jpeg"],
  },
  alternates: {
    canonical: `${SITE_URL}/fr`,
    languages: {
      fr: `${SITE_URL}/fr`,
      en: `${SITE_URL}/en`,
      "x-default": `${SITE_URL}/fr`,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <Analytics />
      <GoogleAnalytics gaId="G-9L7V0EC0B8" />
    </>
  );
}
