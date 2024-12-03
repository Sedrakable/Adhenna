"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./Block.module.scss";
import cn from "classnames";
import FlexDiv from "../../FlexDiv";
import { generateStarPositions } from "../../Star/generateStars";
import {
  calculateImagePositions,
  ImagePositions,
} from "../../DecorativeImages/DecorativeImages";
import { useParallaxScroll } from "@/helpers/useParallaxScroll";
import { TitleWrapper } from "../TitleWrapper/TitleWrapper";
import { useWindowResize } from "@/helpers/useWindowResize";
import dynamic from "next/dynamic";

export const BlockVariants = ["default", "full-width"] as const;
export type BlockVariantType = typeof BlockVariants[number];

const DecorationsLazy = dynamic(
  () =>
    import("../Decorations/Decorations").then((module) => module.Decorations),
  {
    ssr: false,
  }
);

interface BlockProps {
  variant?: BlockVariantType;
  illustrations?: boolean;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Block: React.FC<BlockProps> = ({
  variant = "default",
  illustrations = false,
  children,
  title,
  className,
}) => {
  const { isMobile } = useWindowResize();
  const [imagePositions, setImagePositions] = useState<ImagePositions | null>(
    null
  );
  const [estimatedHeight, setEstimatedHeight] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const [cssLoaded, setCssLoaded] = useState(false);
  const scrollProgress = useParallaxScroll(blockRef);
  const [canRenderDecorations, setCanRenderDecorations] = useState(false);

  useEffect(() => {
    const calculateHeight = () => {
      if (contentRef.current) {
        const childrenCount = React.Children.count(children);
        const itemHeight =
          contentRef.current.querySelector(":first-child")?.clientHeight || 300;
        const estimatedTotalHeight = childrenCount * itemHeight;

        setEstimatedHeight(
          Math.min(estimatedTotalHeight, window.innerHeight * 2)
        );
      }
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, [children]);

  useEffect(() => {
    // Check if the page has finished loading
    const checkPageLoad = () => {
      // Use requestIdleCallback for modern browsers
      if ("requestIdleCallback" in window) {
        requestIdleCallback(
          () => {
            setCanRenderDecorations(true);
          },
          { timeout: 2000 }
        );
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          setCanRenderDecorations(true);
        }, 2000);
      }
    };

    // Check for page load
    if (document.readyState === "complete") {
      checkPageLoad();
    } else {
      window.addEventListener("load", checkPageLoad);
      return () => window.removeEventListener("load", checkPageLoad);
    }
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const observer = new MutationObserver(() => {
      setCssLoaded(true);
      observer.disconnect();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    const timeoutId = setTimeout(() => {
      setCssLoaded(true);
      observer.disconnect();
    }, 1000);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [isMobile]);

  useLayoutEffect(() => {
    if (isMobile || !cssLoaded || !illustrations || !contentRef.current) return;

    const calculateGaps = () => {
      if (!contentRef.current) return;
      const blockStyles = window.getComputedStyle(
        contentRef.current.parentElement!
      );
      const blockTopPadding = parseInt(blockStyles.paddingTop);

      const positions = calculateImagePositions(
        contentRef.current,
        blockTopPadding
      );
      setImagePositions(positions);
    };

    calculateGaps();
    window.addEventListener("resize", () =>
      requestAnimationFrame(calculateGaps)
    );
    return () =>
      window.removeEventListener("resize", () =>
        requestAnimationFrame(calculateGaps)
      );
  }, [cssLoaded, illustrations, children, isMobile]);

  const content = (
    <FlexDiv
      ref={contentRef}
      flex={{ direction: "column", y: "flex-start" }}
      className={cn(styles.content)}
      gapArray={variant === "full-width" ? [11, 10, 11, 12] : [9, 9, 9, 10]}
      width100
      customStyle={{
        minHeight: estimatedHeight ? `${estimatedHeight}px` : "auto",
        transition: "min-height 0.3s ease",
      }}
    >
      {children}
    </FlexDiv>
  );

  return (
    <FlexDiv
      ref={blockRef}
      flex={{ direction: "column", y: "flex-start" }}
      className={cn(styles.block, styles[variant], className)}
      padding={{
        horizontal: variant === "full-width" ? [0] : [6, 8, 11, 12],
        top: variant === "full-width" ? [10, 10, 10, 11] : [7, 7, 8, 9],
        bottom: [0],
      }}
      width100
      as="article"
    >
      {canRenderDecorations &&
        !isMobile &&
        scrollProgress &&
        imagePositions &&
        blockRef && (
          <DecorationsLazy
            scrollProgress={scrollProgress}
            illustrations={illustrations}
            imagePositions={imagePositions}
            blockRef={blockRef}
          />
        )}

      {title ? <TitleWrapper title={title}>{content}</TitleWrapper> : content}
    </FlexDiv>
  );
};
