"use client";
import React, { useEffect } from "react";
import styles from "./Blog.module.scss";
import FlexDiv from "@/components/reuse/FlexDiv";
import { IBlog, LocalPaths } from "@/data.d";
import { Block } from "../../../reuse/containers/Block/Block";
import { TitleWrapper } from "@/components/reuse/containers/TitleWrapper/TitleWrapper";
import { useLocale } from "next-intl";
import { getTranslations } from "@/helpers/langUtils";
import { LangType } from "@/i18n/request";
import { Display } from "@/components/reuse/Display/Display";
import Link from "next/link";
import { useArticleFilters } from "../../../reuse/Form/CustomFilters/useArticleFilters";
import { ArticleFilters } from "@/components/reuse/Form/CustomFilters/ArticleFilters";
import { setToLocalStorage } from "@/helpers/localStorage";
import { ARTICLES_ORDER_STORAGE_KEY } from "../Article/Article";
import { useGoogleEvent } from "@/app/api/sendGoogleEvent";

export const Blog: React.FC<IBlog> = ({ articles }) => {
  const locale = useLocale() as LangType;
  const translations = getTranslations(locale);
  const sendEvent = useGoogleEvent();

  const { filteredArticles, filterHandlers, filterOptions } = useArticleFilters(
    articles,
    translations,
  );

  useEffect(() => {
    setToLocalStorage(ARTICLES_ORDER_STORAGE_KEY, filteredArticles);
  }, [filteredArticles]);

  return (
    articles && (
      <FlexDiv
        flex={{ direction: "column" }}
        width100
        gapArray={[4]}
        padding={{ top: [7, 7, 8, 9] }}
        className={styles.blog}
      >
        <TitleWrapper title={translations.titles.blog}>
          <FlexDiv width100 flex={{ direction: "column" }} gapArray={[4]}>
            <div
              style={{ maxWidth: `var(--screen-width-large)`, width: "100%" }}
            >
              <ArticleFilters
                filterOptions={filterOptions}
                filterHandlers={filterHandlers}
                translations={translations}
              />
            </div>
          </FlexDiv>
        </TitleWrapper>
        <Block variant="full-width" illustrations className={styles.block}>
          <FlexDiv
            width100
            flex={{ direction: "column" }}
            gapArray={[7, 8, 8, 9]}
          >
            {filteredArticles.map((article, index) => {
              return (
                <Link
                  href={`/${locale}${LocalPaths.BLOG}/${article.path}`}
                  aria-label={article.path}
                  key={index}
                  onClick={() => sendEvent(`Click Article`, article.path)}
                >
                  <Display
                    backgroundImage={article.customImage}
                    subTitle={article.title}
                    desc={article.desc}
                    version="article"
                    date={`${article.date} | ${
                      translations.select.articleTypeOptions[article.type]
                    } `}
                    reverse={index % 2 === 0}
                  />
                </Link>
              );
            })}
          </FlexDiv>
        </Block>
      </FlexDiv>
    )
  );
};
