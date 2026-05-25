"use client";
import React, { FC, useCallback, useState } from "react";
import styles from "./Cart.module.scss";
import cn from "classnames";
import FlexDiv from "../../../reuse/FlexDiv";
import { Heading } from "../../../reuse/Heading";
import { ICartProduct, IDeliveryMethod, LocalPaths } from "../../../../data.d";
import { useLocale } from "next-intl";
import { LangType } from "@/i18n/request";
import { Button } from "@/components/reuse/Button";
import { getTranslations } from "@/helpers/langUtils";
import { getFromLocalStorage, setToLocalStorage } from "@/helpers/localStorage";
import { Line } from "@/components/reuse/Line";
import { Paragraph } from "@/components/reuse/Paragraph/Paragraph";
import {
  CartForm,
  CartFormProps,
} from "@/components/reuse/Form/CartForm/CartForm";
import { CART_STORAGE_KEY } from "./useCart";
import { ProductTab } from "../Products/ProductTab";

export interface CartProps {
  deliveryMethods: IDeliveryMethod[];
  title: string;
  subTitle?: string;
}

const round = (num: number) => Math.round(num * 100) / 100;

export const Cart: FC<CartProps> = (props) => {
  const locale = useLocale() as LangType;
  const translations = getTranslations(locale);

  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
  const [cart, setCart] = useState<ICartProduct[]>(
    () => getFromLocalStorage<ICartProduct[]>(CART_STORAGE_KEY) || [],
  );

  const updateCart = useCallback((newCart: ICartProduct[]) => {
    setCart(newCart);
    setToLocalStorage(CART_STORAGE_KEY, newCart);
  }, []);

  // Calculate subtotal
  const subTotalPrice = cart.reduce((total, cartProduct) => {
    const price = parseFloat(cartProduct.product.price);
    return total + price * cartProduct.quantity;
  }, 0);

  // Calculate totals
  const totalWithDelivery = subTotalPrice + deliveryPrice;
  const taxRate = 0.14975; // example tax rate, adjust as needed
  const taxes = totalWithDelivery * taxRate;
  const grandTotalPrice = totalWithDelivery + taxes;

  // Round values once
  const subtotalRounded = round(subTotalPrice);
  const deliveryRounded = round(deliveryPrice);
  const taxesRounded = round(taxes);
  const totalRounded = round(grandTotalPrice);

  const formData: CartFormProps = {
    ...props,
    cart,
    onDeliveryPriceChange: setDeliveryPrice,
  };

  if (cart.length === 0) {
    return (
      <FlexDiv flex={{ direction: "column" }} gapArray={[4]}>
        <Heading as="h3" level="5" color="burgundy" textAlign="center">
          {translations.cart.noItemsInCart}
        </Heading>
        <Button variant="primary" path={`/${locale}${LocalPaths.BOUTIQUE}`}>
          {translations.nav.boutique}
        </Button>
      </FlexDiv>
    );
  }

  return (
    <FlexDiv
      gapArray={[7, 7, 7, 8]}
      width100
      className={cn(styles.container)}
      flex={{ direction: "column" }}
    >
      <FlexDiv
        gapArray={[4, 5, 5, 6]}
        width100
        flex={{ direction: "column", y: "flex-start" }}
      >
        {cart.map((product, key) => (
          <ProductTab
            key={key}
            product={product.product}
            quantity={product.quantity}
            updateCart={updateCart}
          />
        ))}

        <FlexDiv
          flex={{ direction: "column", x: "flex-end" }}
          width100
          gapArray={[4]}
        >
          <Line rotation="horizontal" color="light-burgundy" />

          <FlexDiv
            gapArray={[4]}
            className={cn(styles.totalPrice)}
            width100
            flex={{ x: "space-between" }}
          >
            <Paragraph level="regular" color="burgundy">
              {translations.cart.subtotal}
            </Paragraph>
            <Paragraph level="regular" color="dark-burgundy">
              {subtotalRounded} CAD
            </Paragraph>
          </FlexDiv>

          {deliveryRounded > 0 && (
            <FlexDiv
              gapArray={[4]}
              className={cn(styles.totalPrice)}
              width100
              flex={{ x: "space-between" }}
            >
              <Paragraph level="regular" color="burgundy">
                {translations.cart.shipping}
              </Paragraph>
              <Paragraph level="regular" color="dark-burgundy">
                {deliveryRounded} CAD
              </Paragraph>
            </FlexDiv>
          )}

          <FlexDiv
            gapArray={[4]}
            className={cn(styles.totalPrice)}
            width100
            flex={{ x: "space-between" }}
          >
            <Paragraph level="regular" color="burgundy">
              {translations.cart.taxes}
            </Paragraph>
            <Paragraph level="regular" color="dark-burgundy">
              {taxesRounded} CAD
            </Paragraph>
          </FlexDiv>

          <Line rotation="horizontal" color="light-burgundy" />

          <FlexDiv
            gapArray={[4]}
            className={cn(styles.totalPrice)}
            width100
            flex={{ x: "space-between" }}
          >
            <Paragraph level="big" color="burgundy">
              {translations.cart.total}
            </Paragraph>
            <Paragraph level="big" color="dark-burgundy">
              {totalRounded} CAD
            </Paragraph>
          </FlexDiv>
        </FlexDiv>
      </FlexDiv>

      <Line rotation="vertical" color="light-burgundy" />

      <CartForm {...formData} />
    </FlexDiv>
  );
};
