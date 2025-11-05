import { ISeo, LocalPaths, IHero, IWork } from "@/data.d";
import { fetchPageData } from "@/app/api/useFetchPage";
import { LangType } from "@/i18n/request";
import { Metadata } from "next";
import { setMetadata } from "@/components/SEO";
import { WorkPageProps } from "./[projectType]/page";
import { portfolioPageQuery } from "@/app/api/generateSanityQueries";
import { HistoryProps } from "@/components/pages/blocks/History/History";
import { getCarouselData } from "@/components/reuse/Carousel/getCarouselData";
import { History } from "@/components/pages/blocks/History/History";
import { Block } from "@/components/reuse/containers/Block/Block";
import { Works } from "@/components/pages/blocks/Works/Works";
import { Hero } from "@/components/reuse/Hero/Hero";
import { Carousel } from "@/components/reuse/Carousel/Carousel";

export interface PortfolioPageProps {
  meta: ISeo;
  hero: IHero;
  works: WorkPageProps[];
}

const getPortfolioPageData = async (locale: LangType) => {
  const PortfolioQuery = portfolioPageQuery(locale);
  const PortfolioPageData: PortfolioPageProps = await fetchPageData(
    PortfolioQuery
  );
  return PortfolioPageData;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LangType }>;
}): Promise<Metadata> {
  const { locale } = await params; // Await the params
  const portfolioPageData = await getPortfolioPageData(locale);
  const { metaTitle, metaDesc } = portfolioPageData.meta;
  const path = LocalPaths.PORTFOLIO;
  const crawl = true;

  return setMetadata({
    locale,
    metaTitle,
    metaDesc,
    path,
    crawl,
  });
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: LangType }>;
}) {
  const { locale } = await params; // Await the params
  const portfolioPageData = await getPortfolioPageData(locale);
  const carouselData: IWork[] = await getCarouselData();

  return (
    portfolioPageData && (
      <>
        {portfolioPageData?.hero && (
          <Hero {...portfolioPageData?.hero} version={2} />
        )}

        <Block variant="default" illustrations>
          {portfolioPageData?.works && (
            <Works worksData={portfolioPageData?.works} title={false} />
          )}
        </Block>
        {carouselData && <Carousel data={carouselData} />}
      </>
    )
  );
}
