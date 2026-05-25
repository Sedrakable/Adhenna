"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import styles from "./Products.module.scss";

import { getTranslations } from "@/helpers/langUtils";
import { Alert } from "@/components/reuse/Alert/Alert";
import { Button } from "@/components/reuse/Button";
import { ThumbCarousel } from "@/components/reuse/Carousel/ThumbCarousel";
import { Collapsible } from "@/components/reuse/Collapsible/Collapsible";
import FlexDiv from "@/components/reuse/FlexDiv";
import { Heading } from "@/components/reuse/Heading";
import {
  ParagraphProps,
  Paragraph,
} from "@/components/reuse/Paragraph/Paragraph";
import { Pill } from "@/components/reuse/Pill/Pill";
import { IProduct, LocalPaths } from "@/data.d";
import { LangType } from "@/i18n/request";
import { useCart } from "../Cart/useCart";

export const ProductModal: React.FC<IProduct> = (props) => {
  const {
    images,
    title,
    desc,
    quantityDesc,
    collapsible,
    price,
    originalPrice,
  } = props;
  const locale = useLocale() as LangType;
  const translations = getTranslations(locale);
  const [pillValue, setPillValue] = useState<number>(1);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const { addToCart, checkCartAlert } = useCart();

  const handlePillValueChange = (value: number) => {
    setPillValue(value);
  };

  const onAddToCart = () => {
    if (pillValue > 0) {
      addToCart({ ...props, type: "boutique" }, pillValue);
      setMessage(
        `${pillValue} ${
          pillValue > 1
            ? translations.cart.itemsAddedToCart
            : translations.cart.itemAddedToCart
        }`,
      );
    }
  };

  const paragraphProps: ParagraphProps = {
    level: "big",
    color: "burgundy",
    weight: 400,
    children: null,
  };

  return (
    <FlexDiv
      flex={{ direction: "column", x: "flex-start", y: "flex-start" }}
      gapArray={[5, 6, 7, 8]}
      className={styles.productModal}
      aria-label={title}
      width100
    >
      {images && <ThumbCarousel images={images} />}
      <FlexDiv
        flex={{ direction: "column", y: "flex-start" }}
        className={styles.info}
        gapArray={[5]}
        width100
      >
        <FlexDiv flex={{ direction: "column", x: "flex-start" }} width100>
          <Heading
            as="h4"
            level="3"
            color="dark-burgundy"
            weight={500}
            className={styles.title}
          >
            {title}
          </Heading>
          <Paragraph
            level="regular"
            color="burgundy"
            weight={400}
            paddingBottomArray={[3, 4, 4, 5]}
          >
            {desc}
          </Paragraph>
          <FlexDiv className={styles.textWrapper} gapArray={[3]}>
            <FlexDiv className={styles.priceWrapper} gapArray={[3]}>
              <Paragraph {...paragraphProps} color="dark-burgundy">
                {price}
              </Paragraph>
              {originalPrice && (
                <Paragraph
                  {...paragraphProps}
                  color="burgundy"
                  className={styles.originalPrice}
                >
                  {`(${originalPrice})`}
                </Paragraph>
              )}
            </FlexDiv>
            {quantityDesc && (
              <>
                <Paragraph {...paragraphProps} color="burgundy">
                  •
                </Paragraph>
                <Paragraph {...paragraphProps} color="dark-burgundy">
                  {quantityDesc}
                </Paragraph>
              </>
            )}
          </FlexDiv>
        </FlexDiv>

        {collapsible && <Collapsible {...collapsible} variant="small" />}

        <FlexDiv
          flex={{ x: "flex-start", y: "flex-start" }}
          gapArray={[3, 3, 4, 5]}
          width100
          wrap
        >
          <Pill initialValue={pillValue} onChange={handlePillValueChange} />
          <Button
            variant="primary"
            disabled={pillValue === 0}
            onClick={onAddToCart}
            fit="shrink"
          >
            {translations.buttons.addToCart}
          </Button>
          <div className={styles.cartButtonWrapper}>
            <Button
              variant="extra"
              iconProps={{ icon: "cart" }}
              path={`/${locale}${LocalPaths.CART}`}
              aria-label="go to cart"
            />
            {checkCartAlert && (
              <Alert arrow="left">{translations.cart.checkCartAlert}</Alert>
            )}
          </div>
        </FlexDiv>

        {message && <Alert width100>{message}</Alert>}
      </FlexDiv>
    </FlexDiv>
  );
};
