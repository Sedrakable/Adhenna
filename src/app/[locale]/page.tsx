import { LocalPaths, ISeo, IHomeHero, IReview, IWork } from "@/data.d";
import { fetchPageData } from "@/app/api/useFetchPage";
import { LangType } from "@/i18n/request";
import { Metadata } from "next";
import { setMetadata } from "@/components/SEO";
import { homePageQuery } from "@/app/api/generateSanityQueries";
import { WorkPageProps } from "./portfolio/[projectType]/page";
import { getCarouselData } from "@/components/reuse/Carousel/getCarouselData";
import { BigCTA, BigCTAProps } from "@/components/pages/blocks/BigCTA/BigCTA";
import { Services } from "@/components/pages/home/Services/Services";
import { Reviews } from "@/components/pages/blocks/Reviews/Reviews";
import { Works } from "@/components/pages/blocks/Works/Works";
import { Block } from "@/components/reuse/containers/Block/Block";
import { Hero } from "@/components/reuse/Hero/Hero";
import {
  History,
  HistoryProps,
} from "@/components/pages/blocks/History/History";
import { DisplayProps } from "@/components/reuse/Display/Display";
import { Carousel } from "@/components/reuse/Carousel/Carousel";

export interface HomePageProps {
  meta: ISeo;
  homeHero: IHomeHero;
  services: DisplayProps[];
  works: WorkPageProps[];
  history: HistoryProps;
  reviews: IReview[];
  bigCTA: BigCTAProps;
}

export const getHomePageData = async (locale: LangType) => {
  const homeQuery = homePageQuery(locale);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const homePageData: HomePageProps = await fetchPageData(homeQuery);
  return homePageData;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LangType }>;
}): Promise<Metadata> {
  const { locale } = await params; // Await the params
  const homePageData = await getHomePageData(locale);
  const { metaTitle, metaDesc } = homePageData.meta;
  const path = LocalPaths.HOME;
  const crawl = true;

  return setMetadata({
    locale,
    metaTitle,
    metaDesc,
    path,
    crawl,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: LangType }>;
}) {
  const { locale } = await params; // Await the params
  const homePageData = await getHomePageData(locale);
  const carouselData: IWork[] = await getCarouselData();

  return (
    <>
      {homePageData?.homeHero && (
        <Hero {...homePageData?.homeHero} version={1} />
      )}
      {carouselData && <Carousel data={carouselData} />}

      {homePageData?.services && (
        <Block variant="full-width" illustrations>
          <Services services={homePageData.services} />
        </Block>
      )}
      <Block variant="default" illustrations>
        {homePageData?.works && <Works worksData={homePageData?.works} />}
        {homePageData?.history && <History {...homePageData.history} />}
        {homePageData?.reviews && <Reviews reviews={homePageData.reviews} />}
        {homePageData?.bigCTA && <BigCTA {...homePageData?.bigCTA} />}
      </Block>
    </>
  );
}
