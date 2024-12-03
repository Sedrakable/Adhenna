import React, { FC } from "react";
import FlexDiv from "@/components/reuse/FlexDiv";
import styles from "./FloatingImageWrapper.module.scss";
import {
  ICustomImage,
  SanityImage,
} from "@/components/reuse/SanityImage/SanityImage";
import { useWindowResize } from "@/helpers/useWindowResize";

export interface FloatingImageWrapperProps {
  children: React.ReactNode;
  images: FloatingImages;
}

export interface FloatingImages {
  img1: ICustomImage;
  img2: ICustomImage;
  img3: ICustomImage;
}

export const FloatingImageWrapper: FC<FloatingImageWrapperProps> = ({
  children,
  images,
}) => {
  const { isMobileOrTablet } = useWindowResize();

  const imagesArray = [images.img1, images.img2, images.img3];
  return (
    <FlexDiv gapArray={[6, 7, 8, 9]} className={styles.wrapper} width100>
      {children}
      {!isMobileOrTablet && (
        <FlexDiv
          className={styles.rightSide}
          width100
          flex={{ direction: "column" }}
        >
          {imagesArray.map((image, index) => {
            return (
              <SanityImage
                key={index}
                {...image}
                sizes="(max-width: 1680px) 320px, 240px"
                quality={100}
              />
            );
          })}
        </FlexDiv>
      )}
    </FlexDiv>
  );
};
