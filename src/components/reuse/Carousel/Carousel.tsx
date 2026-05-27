"use client";
import React, { FC, useCallback, useEffect, useState } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

import styles from "./Carousel.module.scss";
import cn from "classnames";

import { ICustomImage, SanityImage } from "../SanityImage/SanityImage";
import { ICta, IWork } from "@/data.d";
import { getImagesFromWorks } from "@/helpers/functions";
import FlexDiv from "../FlexDiv";
import { Button } from "../Button";
import { useLocale } from "next-intl";
import { LangType } from "@/i18n/request";
import { useShuffleArray } from "@/helpers/useShuffleArray";
import { useGoogleEvent } from "@/app/api/sendGoogleEvent";

const OPTIONS: EmblaOptionsType = { dragFree: true, loop: true };

interface ICarouselProps {
  data: IWork[];
  cta?: ICta;
}

export const Carousel: FC<ICarouselProps> = ({ data, cta }) => {
  const locale = useLocale() as LangType;
  const sendEvent = useGoogleEvent();

  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS, [
    AutoScroll({ playOnInit: true }),
  ]);

  const [autoplayPlugin, setAutoplayPlugin] = useState<any>(null);

  useEffect(() => {
    if (emblaApi) {
      setAutoplayPlugin(emblaApi.plugins().autoScroll);
    }
  }, [emblaApi]);

  const onPointerUp = useCallback(() => {
    if (autoplayPlugin) {
      autoplayPlugin.stop();
      setTimeout(() => {
        autoplayPlugin.play();
      }, 1000);
    }
  }, [autoplayPlugin]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("pointerUp", onPointerUp);

      return () => {
        emblaApi.off("pointerUp", onPointerUp);
      };
    }
  }, [emblaApi, onPointerUp]);

  // Shuffle images outside useMemo to follow React's rule of hooks
  const images: ICustomImage[] = getImagesFromWorks(data);

  // Use useShuffleArray hook here, directly passing the array
  const shuffledImages = useShuffleArray(images);

  if (!shuffledImages.length) return null;

  return (
    <FlexDiv
      flex={{ direction: "column", x: "center" }}
      width100
      padding={{ top: [7, 8, 8, 9] }}
    >
      <div className={styles.embla} ref={emblaRef}>
        <div className={styles.embla__container}>
          {shuffledImages.map(
            (image, index) =>
              image?.image && (
                <div className={styles.embla__slide} key={index}>
                  <SanityImage
                    image={image?.image}
                    alt={image?.alt}
                    figureClassName={cn(styles.image)}
                    quality={30}
                  />
                </div>
              ),
          )}
        </div>
      </div>
      {cta && (
        <Button
          variant="primary"
          path={`/${locale}${cta?.link?.join("")}`}
          onClick={() => sendEvent("Click Carousel", cta?.link!.join(""))}
        >
          {cta?.text}
        </Button>
      )}
    </FlexDiv>
  );
};
