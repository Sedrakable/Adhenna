import { productQuery } from "@/app/api/generateSanityQueries";
import { fetchPageData } from "@/app/api/useFetchPage";
import { ProductModal } from "@/components/pages/blocks/Products/ProductModal";
import { Modal } from "@/components/reuse/Modal";
import { setMetadata } from "@/components/SEO";
import { IProduct, LocalPaths } from "@/data.d";
import { LangType } from "@/i18n/request";

const getProductData = async (locale: LangType, slug: string) => {
  const getProductQuery = productQuery(locale, slug);
  const productData: IProduct = await fetchPageData(getProductQuery);

  return productData;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LangType; slug: string }>;
}) {
  const { locale, slug } = await params; // Await the params
  const productPageData: IProduct = await getProductData(locale, slug);
  const path = `${LocalPaths.BOUTIQUE}/${slug}`;
  const crawl = true;

  return setMetadata({
    locale,
    metaTitle: productPageData.title,
    metaDesc: productPageData.desc!,
    metaKeywords: [],
    path,
    crawl,
  });
}

export default async function Product({
  params,
}: {
  params: Promise<{ locale: LangType; slug: string }>;
}) {
  const { locale, slug } = await params; // Await the params
  const productData: IProduct = await getProductData(locale, slug);

  return (
    productData && (
      <Modal>
        <ProductModal {...productData} />
      </Modal>
    )
  );
}
