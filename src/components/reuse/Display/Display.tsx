"use client";
import React from "react";
import styles from "./Display.module.scss";
import FlexDiv from "../../reuse/FlexDiv";
import cn from "classnames";
import { useLocale } from "next-intl";
import { LangType } from "@/i18n";
import { IDisplay } from "@/data.d";
import { useWindowResize } from "@/helpers/useWindowResize";
import { Button } from "../Button";
import { FancyText } from "../FancyText/FancyText";
import { Heading } from "../Heading";
import { Paragraph } from "../Paragraph";
import { SanityImage } from "../SanityImage/SanityImage";

export type VersionType = "service";

interface HeroProps extends IDisplay {
  version: VersionType;
  reverse?: boolean;
}

export const Display: React.FC<HeroProps> = ({
  backgroundImage,
  title,
  subTitle,
  desc,
  ctas,
  version,
  reverse,
}) => {
  const { isMobile } = useWindowResize();
  const locale = useLocale() as LangType;

  const CTAs = () =>
    ctas && (
      <FlexDiv
        gapArray={[4]}
        padding={{ top: [5, 4, 4, 5] }}
        flex={{
          direction: isMobile ? "column" : "row",
          x: reverse ? "flex-end" : "flex-start",
        }}
        width100
      >
        <Button variant="primary" path={`/${locale}${ctas.cta1?.link}`}>
          {ctas.cta1?.text}
        </Button>
        {ctas.cta2 && (
          <Button variant="transparent" path={`/${locale}${ctas.cta2?.link}`}>
            {ctas.cta2?.text}
          </Button>
        )}
        {ctas.cta3 && (
          <Button variant="transparent" path={`/${locale}${ctas.cta3?.link}`}>
            {ctas.cta3?.text}
          </Button>
        )}
      </FlexDiv>
    );

  return (
    <FlexDiv
      className={cn(styles.display, styles["version" + version], {
        [styles.reverse]: reverse,
      })}
      flex={{ direction: "column", y: "flex-start" }}
      width100
    >
      <SanityImage
        image={backgroundImage?.image}
        alt={backgroundImage?.alt}
        figureClassName={cn(styles.image)}
        quality={60}
      />
      <FlexDiv
        className={styles.content}
        flex={{
          direction: "column",
          x: reverse ? "flex-end" : "flex-start",
          y: "stretch",
        }}
        width100
        padding={{ horizontal: [6, 9, 11, 12], bottom: [6, 7, 7, 8] }}
        gapArray={[2]}
      >
        <FancyText
          {...title}
          reverse={reverse}
          overflowText
          flexHorizontal={reverse ? "flex-end" : "flex-start"}
          blocker={!isMobile}
        />
        {subTitle && (
          <Heading
            as="h3"
            level="5"
            color="burgundy"
            weight={500}
            className={styles.subTitle}
            textAlign={reverse ? "right" : "left"}
          >
            {subTitle}
          </Heading>
        )}
        <Paragraph
          level="regular"
          color="darkest-burgundy"
          className={styles.desc}
          textAlign={reverse ? "right" : "left"}
        >
          {desc}
        </Paragraph>
        <CTAs />
      </FlexDiv>
    </FlexDiv>
  );
};