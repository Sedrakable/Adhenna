"use client";
import styles from "./Article.module.scss";
import FlexDiv from "@/components/reuse/FlexDiv";
import { Paragraph } from "@/components/reuse/Paragraph/Paragraph";
import { Block } from "@/components/reuse/containers/Block/Block";
import { IArticle, ICta, LocalPaths } from "@/data.d";
import { Heading } from "@/components/reuse/Heading";
import { SanityImage } from "@/components/reuse/SanityImage/SanityImage";
import { ArticleNavigation } from "./ArticleNavigation/ArticleNavigation";
import { LangType } from "@/i18n/request";
import { useLocale } from "next-intl";
import { Button } from "@/components/reuse/Button";
import { getTranslations } from "@/helpers/langUtils";
import { contentBlocks } from "@/components/reuse/ContentBlock/ContentBlock";
import { TextWrapper } from "@/components/reuse/containers/TextWrapper/TextWrapper";
import { useLocalStorage } from "@/helpers/useLocalStorage";
import { PortableTextContent } from "@/components/reuse/Paragraph/PortableTextContent";

export const ARTICLES_ORDER_STORAGE_KEY = "articlesOrder";

export const Article: React.FC<IArticle> = ({
  content,
  date,
  customImage,
  imageText,
  title,
  desc,
}) => {
  const locale = useLocale() as LangType;
  const trans = getTranslations(locale);
  const [pageOrder] = useLocalStorage<IArticle[]>(
    ARTICLES_ORDER_STORAGE_KEY,
    [],
  );

  // I want to take the article array and turn it into a CTA array
  const ctaPageOrder: ICta[] =
    pageOrder &&
    pageOrder.map((article) => ({
      text: article.title,
      link: [`/${article.path}`],
    }));

  return (
    <Block variant="default" illustrations>
      <FlexDiv
        flex={{ direction: "column", x: "flex-start" }}
        width100
        gapArray={[5]}
      >
        <Button
          variant="extra"
          path={`/${locale}${LocalPaths.BLOG}`}
          fit="shrink"
          iconProps={{
            icon: "arrow",
            rotate: 90,
            side: "left",
            size: "regular",
          }}
        >
          {trans.nav.blog}
        </Button>
        <FlexDiv
          flex={{
            direction: "column",
            x: "flex-start",
          }}
          className={styles.article}
          gapArray={[2, 2, 3, 4]}
          as="article"
        >
          <Paragraph level="big" color="dark-burgundy">
            {date}
          </Paragraph>
          <Heading
            level="4"
            as="h1"
            color="burgundy"
            weight={400}
            paddingBottomArray={[1, 0]}
          >
            {title}
          </Heading>
          <FlexDiv
            flex={{ direction: "column", y: "flex-start" }}
            width100
            className={styles.heading}
            padding={{ bottom: [3, 4, 4, 5] }}
          >
            <FlexDiv
              width100
              className={styles.imgWrapper}
              gapArray={[2]}
              flex={{ direction: "column" }}
            >
              <SanityImage {...customImage} quality={80} priority />
              {imageText && (
                <Paragraph level="small" color="dark-burgundy">
                  {imageText}
                </Paragraph>
              )}
            </FlexDiv>
            <TextWrapper version={2} variant="small">
              <PortableTextContent
                value={desc}
                level="regular"
                color="burgundy"
                weight={500}
                textAlign="center"
              />
            </TextWrapper>
          </FlexDiv>

          <FlexDiv
            flex={{ direction: "column", x: "flex-start" }}
            className={styles.content}
            width100
            as="section"
          >
            {contentBlocks({ blocks: content })}
          </FlexDiv>
        </FlexDiv>
        {ctaPageOrder.length > 1 && (
          <ArticleNavigation pageOrder={ctaPageOrder} />
        )}
      </FlexDiv>
    </Block>
  );
};
