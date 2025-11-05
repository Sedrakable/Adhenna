import { workPageQuery } from "@/app/api/generateSanityQueries";
import { fetchPageData } from "@/app/api/useFetchPage";
import { Projects } from "@/components/pages/blocks/Projects/Projects";
import { Block } from "@/components/reuse/containers/Block/Block";
import { Hero } from "@/components/reuse/Hero/Hero";
import { setMetadata } from "@/components/SEO";
import { IHero, ISeo, IWork, LocalPaths, ProjectType } from "@/data.d";
import { LangType } from "@/i18n/request";
import { Metadata } from "next";

export interface WorkPageProps {
  meta: ISeo;
  path: LocalPaths;
  reserve: boolean;
  hero: IHero;
  work: IWork;
}

export const getWorkPageData = async (slug: string, locale: LangType) => {
  const workQuery = workPageQuery(slug, locale);

  const workData: WorkPageProps = await fetchPageData(workQuery);

  return workData;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LangType; projectType: string }>;
}): Promise<Metadata> {
  const { locale, projectType } = await params; // Await the params
  const portfolioPageData = await getWorkPageData(projectType, locale);
  const { metaTitle, metaDesc } = portfolioPageData.meta;
  const path = `${LocalPaths.PORTFOLIO}/${projectType}`;
  const crawl = true;

  return setMetadata({
    locale,
    metaTitle,
    metaDesc,
    path,
    crawl,
  });
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: LangType; projectType: string }>;
}) {
  const { locale, projectType } = await params; // Await the params
  const workPageData: WorkPageProps = await getWorkPageData(
    projectType,
    locale
  );

  return (
    workPageData && (
      <>
        <Hero {...workPageData.hero} version={3} />
        {workPageData.work.projects && (
          <Block variant="default">
            <Projects
              projects={workPageData.work.projects}
              workType={projectType as ProjectType}
            />
          </Block>
        )}
      </>
    )
  );
}
