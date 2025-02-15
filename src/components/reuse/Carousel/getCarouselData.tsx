import { carouselQuery } from "@/app/api/generateSanityQueries";
import { fetchPageData } from "@/app/api/useFetchPage";
import { IProject, IWork } from "@/data.d";
import { ICustomImage } from "../SanityImage/SanityImage";

export const getCarouselData = async (workType?: string) => {
  const type = "carousel";
  const carouselQueryData = carouselQuery(workType);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const carouselData: IWork[] = await fetchPageData(carouselQueryData);
  return carouselData;
};
