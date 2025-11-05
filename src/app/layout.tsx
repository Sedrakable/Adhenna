import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://adhennatattoo.com"),
  title: "ADHENNA TATTOO | Tattoo & Henna Studio in Montreal",
  description:
    "Professional tattoo and henna studio in Montreal. Custom tattoos, traditional henna, online and in-person courses. Specializing in unique designs and artistic body art.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    alternateLocale: ["fr_CA"],
    url: "https://adhennatattoo.com",
    siteName: "ADHENNA TATTOO",
    title: "ADHENNA TATTOO | Tattoo & Henna Studio in Montreal",
    description:
      "Professional tattoo and henna studio in Montreal. Custom tattoos, traditional henna, online and in-person courses.",
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
    title: "ADHENNA TATTOO | Tattoo & Henna Studio in Montreal",
    description:
      "Professional tattoo and henna studio in Montreal. Custom tattoos, traditional henna, and courses.",
    images: ["https://i.imgur.com/XsJPXnO.jpeg"],
  },
  alternates: {
    canonical: "https://adhennatattoo.com",
    languages: {
      fr: "https://adhennatattoo.com/fr",
      en: "https://adhennatattoo.com/en",
      "x-default": "https://adhennatattoo.com/fr",
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
