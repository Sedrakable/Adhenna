"use client";
import React, { useMemo } from "react";
import Image, { StaticImageData } from "next/image";
import cn from "classnames";
import styles from "./DecorativeImages.module.scss";
import scull from "../../../../public/photos/Scull.jpeg";
import ananas from "../../../../public/photos/Ananas.jpeg";
import girl from "../../../../public/photos/Girl.jpeg";
import pattern from "../../../../public/photos/Pattern.jpeg";

interface DecorativeImageProps {
  position: "left" | "right";
  topOffset: number;
  src: string | StaticImageData;
}

const DECORATIVE_IMAGES = [scull, ananas, girl, pattern];

const DecorativeImage: React.FC<DecorativeImageProps> = ({
  src,
  position,
  topOffset,
}) => (
  <div
    className={cn(styles.decorativeImage, styles[position])}
    style={{ [position]: 0, top: `${topOffset}px`, pointerEvents: "none" }}
  >
    <Image src={src} alt="Decorative image" width={400} height={500} />
  </div>
);

export interface ImagePositions {
  left: number | undefined;
  right: number;
}

// Helper function to get random images
const getRandomImages = () => {
  const shuffled = [...DECORATIVE_IMAGES].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
};

export const calculateImagePositions = (
  contentElement: HTMLDivElement,
  blockTopPadding: number
): ImagePositions | null => {
  const contentChildren = Array.from(contentElement.children);
  if (contentChildren.length < 2) return null;

  const firstObjectHeight = contentChildren[0].getBoundingClientRect().height;
  const contentGap = parseInt(window.getComputedStyle(contentElement).gap);

  const gaps = contentChildren.slice(0, -1).map((child, index) => {
    const currentBottom = (child as HTMLElement).getBoundingClientRect().bottom;
    const nextTop = (contentChildren[
      index + 1
    ] as HTMLElement).getBoundingClientRect().top;
    return (currentBottom + nextTop) / 2;
  });

  if (gaps.length < 1) return null;

  // Normalize and adjust gaps
  const minGap = Math.min(...gaps);
  const normalizedGaps = gaps.map((gap) => gap - minGap);

  const adjustedGaps = normalizedGaps.map(
    (gaps) => gaps + firstObjectHeight + blockTopPadding + contentGap / 2
  );

  // Handle different gap counts
  if (gaps.length === 1) {
    // Only one gap: render right image only
    return {
      left: undefined,
      right: adjustedGaps[0],
    };
  } else if (gaps.length === 2) {
    // Two gaps: left image on second gap, right image on first gap
    return {
      left: adjustedGaps[1],
      right: adjustedGaps[0],
    };
  } else {
    // Three or more gaps: random placement with rules
    let leftGapIndex: number;
    let rightGapIndex: number;

    // Left image: anywhere except first gap
    leftGapIndex = Math.floor(Math.random() * (adjustedGaps.length - 1)) + 1;

    // Right image: anywhere except where left image is
    do {
      rightGapIndex = Math.floor(Math.random() * adjustedGaps.length);
    } while (rightGapIndex === leftGapIndex);

    return {
      left: adjustedGaps[leftGapIndex],
      right: adjustedGaps[rightGapIndex],
    };
  }
};

export const DecorativeImages: React.FC<{ positions: ImagePositions }> = ({
  positions,
}) => {
  // Get two random images
  const [leftImage, rightImage] = useMemo(() => getRandomImages(), []);

  return (
    <>
      {positions.left && (
        <DecorativeImage
          src={leftImage.src}
          position="left"
          topOffset={positions.left}
        />
      )}
      <DecorativeImage
        src={rightImage.src}
        position="right"
        topOffset={positions.right}
      />
    </>
  );
};
