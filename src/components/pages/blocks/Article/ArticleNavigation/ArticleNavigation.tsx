"use client";
import React, { FC } from "react";
import { usePathname } from "@/i18n/navigation";
import { Navigation } from "@/components/reuse/Naviagation/Navigation";
import { ICta, LocalPaths } from "@/data.d";
import { useLocale } from "next-intl";

interface ArticleNavigationProps {
  pageOrder: ICta[];
}

export const ArticleNavigation: FC<ArticleNavigationProps> = ({
  pageOrder,
}) => {
  const locale = useLocale();
  const pathname = usePathname();

  const getButtonPath = (page: ICta) =>
    `/${locale}${LocalPaths.BLOG}${page.link ? page.link[0] : ""}`;

  const currentPageIndex = pageOrder.findIndex((page) =>
    pathname.includes(page.link ? page.link[0] : "")
  );

  const prevPage =
    currentPageIndex > 0
      ? pageOrder[currentPageIndex - 1]
      : pageOrder[pageOrder.length - 1];

  const nextPage =
    currentPageIndex < pageOrder.length - 1
      ? pageOrder[currentPageIndex + 1]
      : pageOrder[0];

  return (
    <Navigation
      prevPage={prevPage}
      nextPage={nextPage}
      getButtonPath={getButtonPath}
    />
  );
};
