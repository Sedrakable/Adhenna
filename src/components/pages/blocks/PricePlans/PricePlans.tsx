"use client";
import React, { CSSProperties, FC, useEffect, useRef, useState } from "react";
import styles from "./PricePlans.module.scss";
import cn from "classnames";
import FlexDiv from "../../../reuse/FlexDiv";
import { Heading } from "../../../reuse/Heading";
import { ICta, IExternalLink } from "../../../../data.d";
import {
  ICustomImage,
  SanityImage,
} from "../../../reuse/SanityImage/SanityImage";
import { getTranslations } from "../../../../helpers/langUtils";
import { useLocale } from "next-intl";
import { LangType } from "@/i18n/request";
import { Paragraph } from "@/components/reuse/Paragraph/Paragraph";
import { useWindowResize } from "@/helpers/useWindowResize";
import { TitleWrapper } from "../../../reuse/containers/TitleWrapper/TitleWrapper";
import { Button } from "@/components/reuse/Button";
import { AnimatedWrapper } from "@/components/reuse/AnimatedWrapper/AnimatedWrapper";
import { PortableTextContent } from "@/components/reuse/Paragraph/PortableTextContent";

export interface PricePlanProps {
  image?: ICustomImage;
  title: string;
  price: string;
  desc?: string;
  features?: string[];
  cta?: ICta;
  externalLink?: IExternalLink;
}

export const PricePlan: FC<PricePlanProps> = ({
  image,
  title,
  price,
  desc,
  features,
  cta,
  externalLink,
}) => {
  const locale = useLocale() as LangType;
  const { isMobileOrTablet } = useWindowResize();

  const containerRef = useRef<HTMLDivElement>(null);
  const [flexDirection, setFlexDirection] = useState<
    CSSProperties["flexDirection"]
  >("column");

  useEffect(() => {
    const updateFlexDirection = () => {
      if (!isMobileOrTablet && containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setFlexDirection(offsetWidth / offsetHeight < 4 / 5 ? "column" : "row");
      }
    };

    window.addEventListener("resize", updateFlexDirection);
    updateFlexDirection();

    return () => {
      window.removeEventListener("resize", updateFlexDirection);
    };
  }, []);

  return (
    <AnimatedWrapper
      from="inside"
      ref={containerRef}
      className={styles.animatedContainer}
    >
      <FlexDiv
        flex={{ x: "flex-start", y: "flex-start" }}
        aria-label={title}
        ref={containerRef}
        className={cn(styles.container, {
          [styles.staticColumn]: flexDirection == "column",
        })}
      >
        {image && (
          <SanityImage
            image={image?.image}
            alt={image?.alt}
            figureClassName={cn(styles.image)}
            quality={50}
          />
        )}

        <FlexDiv
          flex={{ direction: "column", x: "flex-start", y: "flex-start" }}
          className={styles.info}
          gapArray={[3, 3, 3, 3]}
          padding={{
            all: [4, 5, 5, 6],
            vertical: image ? [4, 4, 5, 6] : [3, 4, 4, 5],
          }}
          width100
        >
          <Heading
            as="h4"
            level={image ? "5" : "6"}
            color={image ? "cream-white" : "burgundy"}
            weight={500}
            className={styles.title}
          >
            {title}
          </Heading>
          <FlexDiv
            className={styles.priceWrapper}
            padding={{ vertical: [3], horizontal: [4] }}
          >
            <Paragraph
              level="regular"
              color={image ? "burgundy" : "dark-burgundy"}
              weight={500}
              className={styles.price}
            >
              {price}
            </Paragraph>
          </FlexDiv>
          {desc && (
            <PortableTextContent
              value={desc}
              level="regular"
              color={image ? "cream-white" : "burgundy"}
              weight={400}
              className={styles.desc}
              differentColorForStrongText={false}
              textAlign="justify"
              paddingBottomArray={[3]}
            />
          )}

          {features && (
            <FlexDiv
              className={styles.features}
              flex={{ direction: "column", x: "flex-start", y: "flex-start" }}
              gapArray={[2]}
              padding={{ bottom: [2] }}
            >
              {features.map((feature, key) => {
                return (
                  <Paragraph
                    key={key}
                    level="regular"
                    color="cream-white"
                    weight={400}
                    className={styles.feature}
                  >
                    {feature}
                  </Paragraph>
                );
              })}
            </FlexDiv>
          )}

          {cta && (
            <Button
              variant="extra"
              path={`/${locale}${cta?.link?.join("")}`}
              fit={isMobileOrTablet ? "grow" : undefined}
            >
              {cta.text}
            </Button>
          )}
          {externalLink && (
            <Button
              variant="extra"
              href={externalLink.link}
              fit={isMobileOrTablet ? "grow" : undefined}
              target="_blank"
            >
              {externalLink.text}
            </Button>
          )}
        </FlexDiv>
      </FlexDiv>
    </AnimatedWrapper>
  );
};

export interface PricePlansProps {
  data: PricePlanProps[];

  customTitle?: string;
}
export const PricePlans: React.FC<PricePlansProps> = ({
  data,
  customTitle,
}) => {
  const locale = useLocale() as LangType;
  const translations = getTranslations(locale);
  return (
    <TitleWrapper
      title={customTitle ? customTitle : translations.titles.services}
    >
      <FlexDiv
        gapArray={[6, 4, 5, 6]}
        width100
        className={cn(styles.wrapper)}
        wrap
      >
        {data.map((pricePlan) => {
          return <PricePlan key={pricePlan.title} {...pricePlan} />;
        })}
      </FlexDiv>
    </TitleWrapper>
  );
};
