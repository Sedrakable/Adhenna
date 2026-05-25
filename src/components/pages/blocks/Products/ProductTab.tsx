"use client";

import React, { useCallback, useState } from "react";

import cn from "classnames";
import styles from "./Products.module.scss";

import { getFromLocalStorage } from "@/helpers/localStorage";
import { ICartProduct } from "@/data.d";
import { CART_STORAGE_KEY } from "../Cart/useCart";
import { Button } from "@/components/reuse/Button";
import FlexDiv from "@/components/reuse/FlexDiv";
import { Paragraph } from "@/components/reuse/Paragraph/Paragraph";
import { Pill } from "@/components/reuse/Pill/Pill";
import { SanityImage } from "@/components/reuse/SanityImage/SanityImage";
import { useWindowResize } from "@/helpers/useWindowResize";

interface ProductTabProps extends ICartProduct {
  // eslint-disable-next-line no-unused-vars
  updateCart: (newCart: ICartProduct[]) => void;
}

export const ProductTab: React.FC<ProductTabProps> = ({
  product,
  quantity,
  updateCart,
}) => {
  const { isMobile } = useWindowResize();
  const { images, title, price, originalPrice } = product;
  const productPath = product.path;
  const isBoutique = product.type === "boutique";
  const [pillValue, setPillValue] = useState<number>(quantity);

  const handleRemoveProduct = useCallback(() => {
    const cartProducts =
      getFromLocalStorage<ICartProduct[]>(CART_STORAGE_KEY) || [];
    const updatedCartProducts = cartProducts.filter(
      (item) => item.product.path !== productPath,
    );
    updateCart(updatedCartProducts);
  }, [productPath, updateCart]);

  const handlePillValueChange = (value: number) => {
    setPillValue(value);
    const cartProducts =
      getFromLocalStorage<ICartProduct[]>(CART_STORAGE_KEY) || [];
    const updatedCartProducts = cartProducts.map((item) =>
      item.product.path === productPath ? { ...item, quantity: value } : item,
    );
    updateCart(updatedCartProducts);
  };

  const Controls = ({ small = false }: { small?: boolean }) => (
    <>
      {isBoutique && (
        <Pill
          initialValue={pillValue}
          version="2"
          onChange={handlePillValueChange}
        />
      )}
      <Button
        variant="white"
        small={small}
        onClick={handleRemoveProduct}
        iconProps={{ icon: "trash", size: small ? "small" : undefined }}
      />
    </>
  );

  return (
    <FlexDiv
      flex={{ x: "flex-end" }}
      className={styles.productTab}
      width100
      gapArray={[4, 6, 6, 7]}
      padding={{ all: [3], right: [5] }}
    >
      <FlexDiv
        flex={{ x: "flex-start" }}
        className={styles.left}
        gapArray={[4]}
        width100
      >
        {images && (
          <SanityImage
            image={images[0].image}
            alt={images[0].alt}
            figureClassName={cn(styles.image)}
            quality={1}
          />
        )}
        <FlexDiv
          flex={{ direction: "column", x: "flex-start" }}
          className={styles.text}
        >
          <Paragraph
            level="big"
            color="dark-burgundy"
            weight={500}
            paddingBottomArray={[2, 1]}
          >
            {title}
          </Paragraph>
          <FlexDiv
            className={styles.priceWrapper}
            gapArray={[2]}
            padding={{ bottom: [2] }}
          >
            <Paragraph level="regular" weight={500} color="burgundy">
              {price}
            </Paragraph>
            {originalPrice && (
              <Paragraph
                level="regular"
                weight={500}
                color="burgundy"
                className={styles.originalPrice}
              >
                {`(${originalPrice})`}
              </Paragraph>
            )}
          </FlexDiv>
          {isMobile && (
            <FlexDiv
              flex={{ x: "flex-start" }}
              className={styles.right}
              gapArray={[4]}
            >
              <Controls small />
            </FlexDiv>
          )}
        </FlexDiv>
      </FlexDiv>
      <FlexDiv
        flex={{ x: "flex-end" }}
        className={cn(styles.right, styles.desktopControls)}
        gapArray={[4]}
      >
        <Controls />
      </FlexDiv>
    </FlexDiv>
  );
};
