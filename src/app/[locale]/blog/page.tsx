import { blogPageQuery } from "@/app/api/generateSanityQueries";
import { fetchPageData } from "@/app/api/useFetchPage";
import { Blog } from "@/components/pages/blocks/Blog/Blog";
import { setMetadata } from "@/components/SEO";

import { IBlog, ISeo, LocalPaths } from "@/data.d";
import { LangType } from "@/i18n/request";
import { Metadata } from "next";
import React from "react";

export interface BlogPageProps {
  meta: ISeo;
  blog: IBlog;
}

export const getBlogPageData = async (locale: LangType) => {
  const blogQuery = blogPageQuery(locale);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const blogPageData: BlogPageProps = await fetchPageData(blogQuery);
  return blogPageData;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LangType }>;
}): Promise<Metadata> {
  const { locale } = await params; // Await the params
  const blogPageData: BlogPageProps = await getBlogPageData(locale);
  const { metaTitle, metaDesc } = blogPageData.meta;
  const path = LocalPaths.BLOG;
  const crawl = true;

  return setMetadata({
    locale,
    metaTitle,
    metaDesc,
    path,
    crawl,
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: LangType }>;
}) {
  const { locale } = await params; // Await the params
  const blogPageData: BlogPageProps = await getBlogPageData(locale);

  return blogPageData && <Blog {...blogPageData.blog} />;
}
