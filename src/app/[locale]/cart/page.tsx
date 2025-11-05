import { ISeo, LocalPaths } from "@/data.d";
import { fetchPageData } from "@/app/api/useFetchPage";
import { LangType } from "@/i18n/request";
import { cartPageQuery } from "@/app/api/generateSanityQueries";
import {
  Collapsible,
  CollapsibleProps,
} from "@/components/reuse/Collapsible/Collapsible";
import { Block } from "@/components/reuse/containers/Block/Block";
import { getTranslations } from "@/helpers/langUtils";
import { TitleWrapper } from "@/components/reuse/containers/TitleWrapper/TitleWrapper";
import { Cart, CartProps } from "@/components/pages/blocks/Cart/Cart";
import { getFormData } from "@/components/reuse/Form/getFormData";
import { Metadata } from "next";
import { setMetadata } from "@/components/SEO";

export interface CartPageProps {
  meta: ISeo;
  collapsible: CollapsibleProps;
}

const getCartPageData = async (locale: LangType) => {
  const cartQuery = cartPageQuery(locale);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const cartPageData: CartPageProps = await fetchPageData(cartQuery);
  return cartPageData;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LangType }>;
}): Promise<Metadata> {
  const { locale } = await params; // Await the params
  const cartPageData = await getCartPageData(locale);
  const { metaTitle, metaDesc } = cartPageData.meta;
  const path = LocalPaths.CART;
  const crawl = false;

  return setMetadata({
    locale,
    metaTitle,
    metaDesc,
    path,
    crawl,
  });
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: LangType }>;
}) {
  const { locale } = await params; // Await the params
  const data = await getCartPageData(locale);
  const translations = getTranslations(locale);
  const formData: CartProps = await getFormData("cart", locale);

  return (
    <Block variant="default" illustrations>
      <TitleWrapper title={translations.titles.cart}>
        <Cart {...formData} />
      </TitleWrapper>

      {data?.collapsible && <Collapsible {...data.collapsible} />}
    </Block>
  );
}
