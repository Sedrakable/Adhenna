"use client";
import React, { FC, useState } from "react";

import styles from "./Projects.module.scss";
import cn from "classnames";

import FlexDiv from "../../../reuse/FlexDiv";
import { SanityImage } from "@/components/reuse/SanityImage/SanityImage";
import { ICanvas, IProduct, LocalPaths } from "@/data.d";
import { Alert } from "@/components/reuse/Alert/Alert";
import { Button } from "@/components/reuse/Button";

import { getTranslations } from "@/helpers/langUtils";
import { LangType } from "@/i18n/request";
import { useLocale } from "next-intl";
import { useCart } from "../Cart/useCart";
import { Heading } from "@/components/reuse/Heading";

interface CanvasModalProps {
  project: ICanvas;
}

export const CanvasModal: FC<CanvasModalProps> = ({ project }) => {
  const locale = useLocale() as LangType;
  const translations = getTranslations(locale);

  const [message, setMessage] = useState<string | undefined>(undefined);
  const { addToCart, checkCartAlert } = useCart();

  const onAddToCart = () => {
    const toilesAsProduct: IProduct = {
      path: project.image.alt,
      title: project.title,
      images: [project.image],
      price: project.price,
      type: "toiles",
    };
    addToCart(toilesAsProduct, 1);
    setMessage(translations.cart.itemAddedToCart);
  };

  return (
    <FlexDiv
      gapArray={[4]}
      flex={{ direction: "column" }}
      width100
      className={styles.toilesModalContainer}
      padding={{ top: [5, 3, 2, 0] }}
    >
      <FlexDiv
        flex={{ x: "space-between", y: "center" }}
        gapArray={[5]}
        width100
        wrap
        className={styles.top}
      >
        <Heading
          as="h3"
          level="5"
          color="burgundy"
          weight={400}
          textAlign="center"
          className={styles.title}
        >
          {`${project.title} • ${project.price}$`}
        </Heading>
        <FlexDiv gapArray={[4, 4, 3, 4]}>
          <Button variant="primary" onClick={onAddToCart} fit="shrink">
            {translations.buttons.addToCart}
          </Button>
          <div className={styles.cartButtonWrapper}>
            <Button
              variant="extra"
              iconProps={{ icon: "cart" }}
              path={`/${locale}${LocalPaths.CART}`}
            />
            {checkCartAlert && (
              <Alert arrow="left">{translations.cart.checkCartAlert}</Alert>
            )}
          </div>
        </FlexDiv>
      </FlexDiv>

      {message && <Alert width100>{message}</Alert>}

      <SanityImage
        image={project?.image.image}
        alt={project?.image.alt}
        figureClassName={cn(styles.modalImage, styles.image)}
        quality={100}
        priority
      />
    </FlexDiv>
  );
};
