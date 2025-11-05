// Next.js and React imports
import { Metadata } from "next";

// API and data fetching
import { onlineCoursePageQuery } from "@/app/api/generateSanityQueries";
import { fetchPageData } from "@/app/api/useFetchPage";

// Components, Types and interfaces
import { Hero } from "@/components/reuse/Hero/Hero";
import { Block } from "@/components/reuse/containers/Block/Block";

// Types and interfaces
import { IHero, ISeo, LocalPaths } from "@/data.d";
import { LangType } from "@/i18n/request";

// Utilities
import { setMetadata } from "@/components/SEO";
import { TextWrapper } from "@/components/reuse/containers/TextWrapper/TextWrapper";
import { PortableTextContent } from "@/components/reuse/Paragraph/PortableTextContent";
import { Services } from "@/components/pages/home/Services/Services";
import {
  VideoAndPrice,
  VideoAndPriceProps,
} from "@/components/reuse/Video/Video";
import { DisplayProps } from "@/components/reuse/Display/Display";

export interface OnlineCoursePageProps extends VideoAndPriceProps {
  meta: ISeo;
  hero: IHero;
  desc: any;
  features: DisplayProps[];
}

export const getOnlineCoursePageData = async (locale: LangType) => {
  const onlineCourseQuery = onlineCoursePageQuery(locale);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const onlineCoursePageData: OnlineCoursePageProps = await fetchPageData(
    onlineCourseQuery
  );
  console.log("Online Course Page Data:", onlineCoursePageData);
  return onlineCoursePageData;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LangType }>;
}): Promise<Metadata> {
  const { locale } = await params; // Await the params
  const onlineCoursePageData: OnlineCoursePageProps = await getOnlineCoursePageData(
    locale
  );
  const { metaTitle, metaDesc } = onlineCoursePageData?.meta || {};
  const path = LocalPaths.COURSE + LocalPaths.ONLINE;
  const crawl = true;

  return setMetadata({
    locale,
    metaTitle,
    metaDesc,
    path,
    crawl,
  });
}

export default async function OnlineCoursePage({
  params,
}: {
  params: Promise<{ locale: LangType }>;
}) {
  const { locale } = await params; // Await the params
  const onlineCoursePageData = await getOnlineCoursePageData(locale);

  return (
    onlineCoursePageData && (
      <>
        {onlineCoursePageData?.hero && (
          <Hero {...onlineCoursePageData?.hero} version={2} />
        )}

        <Block variant="default" illustrations>
          {onlineCoursePageData?.desc && (
            <TextWrapper version={3}>
              <PortableTextContent
                value={onlineCoursePageData.desc}
                color="dark-burgundy"
                textAlign="center"
                level="regular"
              />
            </TextWrapper>
          )}
          {onlineCoursePageData.pricePlan && onlineCoursePageData.video && (
            <VideoAndPrice
              pricePlan={onlineCoursePageData.pricePlan}
              video={onlineCoursePageData.video}
            />
          )}
        </Block>
        {onlineCoursePageData?.features && (
          <Block variant="full-width" illustrations>
            <Services services={onlineCoursePageData.features} />
          </Block>
        )}
      </>
    )
  );
}
