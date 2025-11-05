import React from "react";

import { fetchPageData } from "@/app/api/useFetchPage";
import { IArticle, ISeo, LocalPaths } from "@/data.d";
import { LangType } from "@/i18n/request";
import { Metadata } from "next";
import { setMetadata } from "@/components/SEO";
import { articlePageQuery } from "@/app/api/generateSanityQueries";
import { Article } from "@/components/pages/blocks/Article/Article";

interface ArticlePageProps extends IArticle {
  meta: ISeo;
}

const getArticlePageData = async (locale: LangType, slug: string) => {
  const articleQuery = articlePageQuery(locale, slug);
  const articleData: ArticlePageProps = await fetchPageData(articleQuery);

  return articleData;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LangType; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params; // Await the params
  const articlePageData: ArticlePageProps = await getArticlePageData(
    locale,
    slug
  );
  const { metaTitle, metaDesc } = articlePageData.meta;
  const path = `${LocalPaths.BLOG}/${slug}`;
  const crawl = true;

  return setMetadata({
    locale,
    metaTitle,
    metaDesc,
    path,
    crawl,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: LangType; slug: string }>;
}) {
  const { locale, slug } = await params; // Await the params
  const articleData: ArticlePageProps = await getArticlePageData(locale, slug);

  return articleData && <Article {...articleData} />;
}
