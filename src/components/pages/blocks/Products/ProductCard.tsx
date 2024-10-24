"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import cn from "classnames";
import styles from "./Products.module.scss";
import { IProduct, LocalPaths } from "@/data.d";
import { LangType } from "@/i18n";
import { Heading } from "@/components/reuse/Heading";
import { Button } from "@/components/reuse/Button";

import { getTranslations } from "@/helpers/langUtils";
import { useCart } from "../Cart/useCart";
import FlexDiv from "@/components/reuse/FlexDiv";
import { Paragraph } from "@/components/reuse/Paragraph/Paragraph";
import { SanityImage } from "@/components/reuse/SanityImage/SanityImage";

export const ProductCard: React.FC<IProduct> = (props) => {
  const { images, title, price, quantityDesc, path } = props;
  const locale = useLocale() as LangType;
  const translations = getTranslations(locale);
  const { addToCart } = useCart();

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart({ ...props, type: "boutique" }, 1);
  };

  return (
    <Link href={`/${locale}${LocalPaths.BOUTIQUE}/${path}`} aria-label={title}>
      <FlexDiv
        flex={{ direction: "column", x: "flex-start", y: "flex-start" }}
        className={styles.product}
        aria-label={title}
      >
        {images && (
          <SanityImage
            image={images[0].image}
            alt={images[0].alt}
            figureclassname={cn(styles.image)}
            quality={50}
          />
        )}

        <FlexDiv
          flex={{ x: "space-between", y: "flex-start" }}
          className={styles.info}
          gapArray={[3]}
          padding={{ top: [4] }}
          width100
          wrap
        >
          <FlexDiv
            flex={{ direction: "row", x: "space-between", y: "flex-start" }}
            className={styles.left}
            gapArray={[3]}
            width100
            wrap
          >
            <Heading
              as="h4"
              level="6"
              color="dark-burgundy"
              weight={500}
              className={styles.title}
            >
              {title}
            </Heading>
            <FlexDiv
              flex={{ direction: "row", x: "flex-start", y: "flex-start" }}
              className={styles.textWrapper}
              gapArray={[3]}
            >
              <Paragraph
                level="regular"
                color="burgundy"
                weight={500}
                className={styles.price}
              >
                ${price}
              </Paragraph>
              {quantityDesc && (
                <>
                  <Paragraph
                    level="regular"
                    color="burgundy"
                    weight={500}
                    className={styles.price}
                  >
                    •
                  </Paragraph>
                  <Paragraph
                    level="regular"
                    color="burgundy"
                    weight={500}
                    className={styles.desc}
                  >
                    {quantityDesc}
                  </Paragraph>
                </>
              )}
            </FlexDiv>
          </FlexDiv>
          {path && (
            <Button
              variant="transparent"
              small
              onClick={(e) => handleAddToCart(e)}
              iconProps={{ icon: "cart" }}
              fit="shrink"
            >
              {translations.buttons.addToCart}
            </Button>
          )}
        </FlexDiv>
      </FlexDiv>
    </Link>
  );
};