// Next.js and React imports
import { Metadata } from "next";

// API and data fetching
import { hennaServicePageQuery } from "@/app/api/generateSanityQueries";
import { fetchPageData } from "@/app/api/useFetchPage";
import { getCarouselData } from "@/components/reuse/Carousel/getCarouselData";

// Components, Types and interfaces
import { Hero } from "@/components/reuse/Hero/Hero";
import { Block } from "@/components/reuse/containers/Block/Block";
import { TitleAndText } from "@/components/reuse/TitleAndText/TitleAndText";
import {
  PricePlans,
  PricePlanProps,
} from "@/components/pages/blocks/PricePlans/PricePlans";
import {
  MultiDescription,
  DescriptionProps,
} from "@/components/pages/blocks/MultiDescription/MultiDescription";

// Types and interfaces
import { IHero, ISeo, IWork, LocalPaths } from "@/data.d";
import { LangType } from "@/i18n/request";

// Utilities
import { setMetadata } from "@/components/SEO";
import { getTranslations } from "@/helpers/langUtils";
import { Approx, ApproxProps } from "@/components/pages/blocks/Approx/Approx";
import { getImagesFromWorks, shuffleArray } from "@/helpers/functions";
import { FormTitleProps } from "@/components/reuse/Form/Form";
import { getFormData } from "@/components/reuse/Form/getFormData";
import { Carousel } from "@/components/reuse/Carousel/Carousel";

export interface HennaServicePageProps {
  meta: ISeo;
  hero: IHero;
  tarifText: string;
  pricePlans: PricePlanProps[];
  multiDescriptions: DescriptionProps[];
}

export const getHennaServicePageData = async (locale: LangType) => {
  const hennaServiceQuery = hennaServicePageQuery(locale);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const hennaServicePageData: HennaServicePageProps = await fetchPageData(
    hennaServiceQuery
  );
  return hennaServicePageData;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LangType }>;
}): Promise<Metadata> {
  const { locale } = await params; // Await the params
  const hennaServicePageData: HennaServicePageProps = await getHennaServicePageData(
    locale
  );
  const { metaTitle, metaDesc } = hennaServicePageData?.meta || {};
  const path = LocalPaths.SERVICE + LocalPaths.HENNA;
  const crawl = true;

  return setMetadata({
    locale,
    metaTitle,
    metaDesc,
    path,
    crawl,
  });
}

export default async function HennaServicePage({
  params,
}: {
  params: Promise<{ locale: LangType }>;
}) {
  const { locale } = await params; // Await the params
  const translations = getTranslations(locale);

  const hennaServicePageData = await getHennaServicePageData(locale);
  const carouselData: IWork[] = await getCarouselData("henna");
  const formData: FormTitleProps = await getFormData("approx", locale);

  const images = shuffleArray(getImagesFromWorks(carouselData));
  const approxData: ApproxProps = {
    form: {
      ...formData,
    },
    images: {
      img1: images[0],
      img2: images[1],
      img3: images[2],
    },
    plan: "Henna Approximatif",
    locale,
  };

  return (
    hennaServicePageData && (
      <>
        <Hero {...hennaServicePageData?.hero} version={2} />

        <Block variant="default" illustrations>
          {hennaServicePageData.tarifText && (
            <TitleAndText
              text={hennaServicePageData.tarifText}
              title={translations.titles.tarif}
            />
          )}
          {hennaServicePageData.pricePlans && (
            <PricePlans data={hennaServicePageData.pricePlans} />
          )}
          {hennaServicePageData.multiDescriptions && (
            <MultiDescription descs={hennaServicePageData.multiDescriptions} />
          )}
          {approxData && <Approx {...approxData} />}
        </Block>
        {carouselData && (
          <Carousel
            data={carouselData}
            cta={{
              text: translations.buttons.view + " " + translations.nav.henna,
            }}
          />
        )}
      </>
    )
  );
}
