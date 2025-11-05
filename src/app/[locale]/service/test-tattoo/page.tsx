// Next.js and React imports
import { Metadata } from "next";

// Styling
import styles from "@/styles/jagua.module.scss";

// API and data fetching
import { testTattooServicePageQuery } from "@/app/api/generateSanityQueries";
import { fetchPageData } from "@/app/api/useFetchPage";

// Components, Types and interfaces
import { Hero } from "@/components/reuse/Hero/Hero";
import { Block } from "@/components/reuse/containers/Block/Block";
import {
  PricePlans,
  PricePlanProps,
} from "@/components/pages/blocks/PricePlans/PricePlans";
import { BigCTA, BigCTAProps } from "@/components/pages/blocks/BigCTA/BigCTA";

// Types and interfaces
import { IHero, ISeo, LocalPaths } from "@/data.d";
import { LangType } from "@/i18n/request";

// Utilities
import { setMetadata } from "@/components/SEO";
import { TextWrapper } from "@/components/reuse/containers/TextWrapper/TextWrapper";
import { PortableTextContent } from "@/components/reuse/Paragraph/PortableTextContent";
import { Display, DisplayProps } from "@/components/reuse/Display/Display";
import { getTranslations } from "@/helpers/langUtils";

export interface TestTattooServicePageProps {
  meta: ISeo;
  hero: IHero;
  display: DisplayProps;
  desc: any;
  pricePlans: PricePlanProps[];
  bigCTA: BigCTAProps;
}

export const getTestTattooServicePageData = async (locale: LangType) => {
  const tattooServiceQuery = testTattooServicePageQuery(locale);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const testTattooServicePageData: TestTattooServicePageProps = await fetchPageData(
    tattooServiceQuery
  );
  return testTattooServicePageData;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LangType }>;
}): Promise<Metadata> {
  const { locale } = await params; // Await the params
  const testTattooServicePageData: TestTattooServicePageProps = await getTestTattooServicePageData(
    locale
  );
  const { metaTitle, metaDesc } = testTattooServicePageData?.meta || {};
  const path = LocalPaths.SERVICE + LocalPaths.TEST_TATTOO;
  const crawl = true;

  return setMetadata({
    locale,
    metaTitle,
    metaDesc,
    path,
    crawl,
  });
}

export default async function TestTattooServicePage({
  params,
}: {
  params: Promise<{ locale: LangType }>;
}) {
  const { locale } = await params; // Await the params
  const trans = getTranslations(locale);
  const testTattooServicePageData = await getTestTattooServicePageData(locale);

  return (
    testTattooServicePageData && (
      <div className={styles.jaguaWrapper}>
        <Hero {...testTattooServicePageData?.hero} version={2} />

        {testTattooServicePageData.display && (
          <Block variant="full-width">
            <Display
              {...testTattooServicePageData?.display}
              version="service"
            />
          </Block>
        )}

        <Block variant="default" illustrations title={trans.titles.tarif}>
          {testTattooServicePageData.desc && (
            <TextWrapper version={3} direction="column">
              <PortableTextContent
                value={testTattooServicePageData.desc}
                color="dark-burgundy"
                textAlign="center"
                level="regular"
              />
            </TextWrapper>
          )}

          {testTattooServicePageData.pricePlans && (
            <PricePlans data={testTattooServicePageData.pricePlans} />
          )}

          {testTattooServicePageData?.bigCTA && (
            <BigCTA {...testTattooServicePageData?.bigCTA} />
          )}
        </Block>
      </div>
    )
  );
}
