"use client";

import { PortableText, PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@sanity/types";
import type { SanityImageSource } from "@sanity/asset-utils";
import cn from "classnames";

import { Paragraph } from "../Paragraph/Paragraph";
import { Heading, josefin } from "../Heading";
import { SanityImage } from "../SanityImage/SanityImage";
import styles from "./ContentBlock.module.scss";

export interface ISanityImageBlock {
  _type: "image";
  _key?: string;
  asset: SanityImageSource;
  alt?: string;
  caption?: string;
  size?: "small" | "medium" | "large" | "full";
}

export type ContentBlockValue = PortableTextBlock | ISanityImageBlock;

const renderImageBlock = (block: ISanityImageBlock) => (
  <div
    className={cn(
      styles.imageBlock,
      styles[`imageBlock--${block.size || "full"}`],
    )}
  >
    <div className={styles.imageWrapper}>
      <SanityImage image={block.asset} alt={block.alt || ""} quality={80} />
    </div>
    {block.caption && (
      <Paragraph
        level="small"
        color="dark-burgundy"
        className={styles.imageCaption}
      >
        {block.caption}
      </Paragraph>
    )}
  </div>
);

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <Paragraph
        level="regular"
        color="darkest-burgundy"
        paddingBottomArray={[2, 3, 3, 4]}
      >
        {children}
      </Paragraph>
    ),
    blockquote: ({ children }) => (
      <Paragraph
        level="big"
        color="burgundy"
        className={styles.blockquote}
      >
        {children}
      </Paragraph>
    ),
    h5: ({ children }) => (
      <Heading
        className={styles.heading}
        as="h5"
        weight={400}
        level="3"
        color="burgundy"
        paddingBottomArray={[2]}
      >
        {children}
      </Heading>
    ),
  },
  list: {
    number: ({ children }) => (
      <ol className={styles.numberedList}>{children}</ol>
    ),
    bullet: ({ children }) => (
      <ul className={styles.bulletedList}>{children}</ul>
    ),
  },
  listItem: {
    number: ({ children, value }) => (
      <li
        className={cn(styles.listItem, josefin.className, {
          [styles.letter]: (value.level || 1) > 1,
        })}
      >
        {children}
      </li>
    ),
    bullet: ({ children, value }) => (
      <li
        className={cn(styles.listItem, josefin.className, {
          [styles.letter]: (value.level || 1) > 1,
        })}
      >
        {children}
      </li>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        {children}
      </a>
    ),
    underline: ({ children }) => (
      <span className={styles.underline}>{children}</span>
    ),
  },
  types: {
    image: ({ value }) => renderImageBlock(value as ISanityImageBlock),
  },
};

export const contentBlocks = ({ blocks }: { blocks: ContentBlockValue[] }) => (
  <PortableText value={blocks} components={components} />
);
