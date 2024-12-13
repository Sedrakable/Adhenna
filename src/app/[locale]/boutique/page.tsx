import { fetchPageData } from "@/app/api/useFetchPage";
import { Services } from "@/components/pages/home/Services/Services";
import { getCarouselData } from "@/components/reuse/Carousel/getCarouselData";
import { Block } from "@/components/reuse/containers/Block/Block";
import { TextWrapper } from "@/components/reuse/containers/TextWrapper/TextWrapper";
import { Hero } from "@/components/reuse/Hero/Hero";
import { PortableTextContent } from "@/components/reuse/Paragraph/PortableTextContent";
import { setMetadata } from "@/components/SEO";
import { IHero, IProduct, ISeo, IWork, LocalPaths } from "@/data.d";
import { LangType } from "@/i18n/request";
import { Metadata } from "next";
import { boutiquePageQuery } from "@/app/api/generateSanityQueries";
import { ProductGrid } from "@/components/pages/blocks/Products/Products";
import { DisplayProps } from "@/components/reuse/Display/Display";
import { Carousel } from "@/components/reuse/Carousel/Carousel";

export interface BoutiquePageProps {
  meta: ISeo;
  hero: IHero;
  displays: DisplayProps[];
  desc: any;
  products: IProduct[];
}

export const getBoutiquePageData = async (locale: LangType) => {
  const homeQuery = boutiquePageQuery(locale);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const boutiquePageData: BoutiquePageProps = await fetchPageData(homeQuery);
  return boutiquePageData;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LangType }>;
}): Promise<Metadata> {
  const { locale } = await params; // Await the params
  const boutiquePageData: BoutiquePageProps = await getBoutiquePageData(locale);
  const { metaTitle, metaDesc, metaKeywords } = boutiquePageData?.meta || {};
  const path = LocalPaths.BOUTIQUE;
  const crawl = true;

  return setMetadata({
    locale,
    metaTitle,
    metaDesc,
    metaKeywords,
    path,
    crawl,
  });
}

export default async function BoutiquePage({
  params,
}: {
  params: Promise<{ locale: LangType }>;
}) {
  const { locale } = await params; // Await the params
  const boutiquePageData = await getBoutiquePageData(locale);
  const carouselData: IWork[] = await getCarouselData();

  return (
    boutiquePageData && (
      <>
        {boutiquePageData?.hero && (
          <Hero {...boutiquePageData?.hero} version={2} />
        )}
        {boutiquePageData?.displays && (
          <Block variant="full-width">
            <Services services={boutiquePageData.displays} />
          </Block>
        )}
        <Block variant="default" illustrations>
          {boutiquePageData.desc && (
            <TextWrapper version={3}>
              <PortableTextContent
                value={boutiquePageData.desc}
                color="dark-burgundy"
                textAlign="center"
                level="regular"
              />
            </TextWrapper>
          )}

          {boutiquePageData.products && (
            <ProductGrid products={boutiquePageData.products} />
          )}
        </Block>
        {carouselData && <Carousel data={carouselData} />}
      </>
    )
  );
}
