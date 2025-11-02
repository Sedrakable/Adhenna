/* eslint-disable @next/next/no-img-element */
import { Inter } from "next/font/google";
// import { GoogleAnalytics } from "@next/third-parties/google";
import styles from "./layout.module.scss";
import "@/styles/Main.css";
import "@/styles/ScrollBar.scss";
import "@/styles/index.scss";
import { NextIntlClientProvider } from "next-intl";
import { IOpeningHours, ISocials } from "@/data.d";
import { fetchPageData } from "../api/useFetchPage";
import { LangType } from "@/i18n/request";
import { hoursQuery, socialsQuery } from "../api/generateSanityQueries";
import { Navbar } from "@/components/navbar/Navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

const getHoursData = async () => {
  const hoursPageData: IOpeningHours = await fetchPageData(hoursQuery());
  return hoursPageData;
};

//I need to get socials data the same way as the hours data
const getSocialsData = async () => {
  const socialsPageData: ISocials = await fetchPageData(socialsQuery());
  return socialsPageData;
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: LangType }>;
}>) {
  const [socialsData, hoursData] = await Promise.all([
    getSocialsData(),
    getHoursData(),
  ]);

  const { locale } = await params; // Await the params

  return (
    locale && (
      <html lang={locale}>
        <NextIntlClientProvider locale={locale}>
          <head>
            <meta name="theme-color" content="#853d57" />
            <meta name="enviroment" content={process.env.NODE_ENV} />
          </head>
          <body className={inter.className}>
            <div id="root">
              <div className={styles.app}>
                <Navbar socials={socialsData} />
                <div className={styles.page}>{children}</div>
                <Footer socials={socialsData} openingHours={hoursData} />
              </div>
            </div>
          </body>
          {/* <GoogleAnalytics gaId={process.env.GOOGLE_ID!} /> */}
        </NextIntlClientProvider>
      </html>
    )
  );
}
