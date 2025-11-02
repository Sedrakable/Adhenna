import { fetchPageData } from "@/app/api/useFetchPage";
import { LangType } from "@/i18n/request";
import { formQuery } from "@/app/api/generateSanityQueries";

export const getFormData = async (slug: string, locale: LangType) => {
  const query = formQuery(slug, locale);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const data = await fetchPageData(query);
  return data;
};
