// Next.js and React imports
import { Metadata } from "next";

// API and data fetching
import { tattooServicePageQuery } from "@/app/api/generateSanityQueries";
import { fetchPageData } from "@/app/api/useFetchPage";
import { getCarouselData } from "@/components/reuse/Carousel/getCarouselData";

// Components, Types and interfaces
import { Hero } from "@/components/reuse/Hero/Hero";
import { Block } from "@/components/reuse/containers/Block/Block";
import {
  PricePlans,
  PricePlanProps,
} from "@/components/pages/blocks/PricePlans/PricePlans";
import {
  MultiDescription,
  DescriptionProps,
} from "@/components/pages/blocks/MultiDescription/MultiDescription";
import {
  Collapsible,
  CollapsibleProps,
} from "@/components/reuse/Collapsible/Collapsible";

// Types and interfaces
import { IHero, ISeo, IWork, LocalPaths } from "@/data.d";
import { LangType } from "@/i18n/request";

// Utilities
import { setMetadata } from "@/components/SEO";
import { getTranslations } from "@/helpers/langUtils";
import { TitleAndText } from "@/components/reuse/TitleAndText/TitleAndText";
import { getImagesFromWorks, shuffleArray } from "@/helpers/functions";
import { getFormData } from "@/components/reuse/Form/getFormData";
import { FormTitleProps } from "@/components/reuse/Form/Form";
import { Approx, ApproxProps } from "@/components/pages/blocks/Approx/Approx";
import { Carousel } from "@/components/reuse/Carousel/Carousel";

export interface TattooServicePageProps {
  meta: ISeo;
  hero: IHero;
  tarifText: string;
  pricePlans: PricePlanProps[];
  multiDescriptions: DescriptionProps[];
  collapsible: CollapsibleProps;
}

export const getTattooServicePageData = async (locale: LangType) => {
  const tattooServiceQuery = tattooServicePageQuery(locale);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const tattooServicePageData: TattooServicePageProps = await fetchPageData(
    tattooServiceQuery
  );
  return tattooServicePageData;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LangType }>;
}): Promise<Metadata> {
  const { locale } = await params; // Await the params
  const tattooServicePageData: TattooServicePageProps = await getTattooServicePageData(
    locale
  );
  const { metaTitle, metaDesc } = tattooServicePageData?.meta || {};
  const path = LocalPaths.SERVICE + LocalPaths.TATTOO;
  const crawl = true;

  return setMetadata({
    locale,
    metaTitle,
    metaDesc,
    path,
    crawl,
  });
}

export default async function TattooServicePage({
  params,
}: {
  params: Promise<{ locale: LangType }>;
}) {
  const { locale } = await params; // Await the params
  const translations = getTranslations(locale);

  const tattooServicePageData = await getTattooServicePageData(locale);
  const carouselData: IWork[] = await getCarouselData("tattoo");

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
    plan: "Tattoo Approximatif",
    locale,
  };
  return (
    tattooServicePageData && (
      <>
        {tattooServicePageData?.hero && (
          <Hero {...tattooServicePageData?.hero} version={2} />
        )}

        <Block variant="default" illustrations>
          {tattooServicePageData.tarifText && (
            <TitleAndText
              title={translations.titles.tarif}
              text={tattooServicePageData.tarifText}
            />
          )}
          {tattooServicePageData.pricePlans && (
            <PricePlans data={tattooServicePageData.pricePlans} />
          )}
          {tattooServicePageData.multiDescriptions && (
            <MultiDescription descs={tattooServicePageData.multiDescriptions} />
          )}
          {approxData && <Approx {...approxData} />}
        </Block>
        {carouselData && (
          <Carousel
            data={carouselData}
            cta={{
              text: translations.buttons.view + " " + translations.nav.tattoo,
              link: [LocalPaths.PORTFOLIO, LocalPaths.TATTOO],
            }}
          />
        )}
        <Block variant="default">
          {tattooServicePageData.collapsible && (
            <Collapsible {...tattooServicePageData.collapsible} />
          )}
        </Block>
      </>
    )
  );
}
