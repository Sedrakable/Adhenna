"use client";
import { Fragment } from "react";
import styles from "./ContentBlock.module.scss";
import cn from "classnames";

import { IBlock } from "@/data.d";
import { Paragraph } from "../Paragraph/Paragraph";
import { Heading, josefin } from "../Heading";

const renderTextWithMarks = (
  children: IBlock["children"],
  markDefs: IBlock["markDefs"]
) => {
  return (
    <Fragment>
      {children.map((child, index) => {
        if (child.marks.length === 0) {
          return <Fragment key={child._key || index}>{child.text}</Fragment>;
        }

        return child.marks.reduce((text, markKey) => {
          const linkDef = markDefs.find(
            (def) => def._key === markKey && def._type === "link"
          );

          if (linkDef) {
            return (
              <a
                key={child._key || index}
                href={linkDef.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {text}
              </a>
            );
          }

          switch (markKey) {
            case "strong":
              return <strong key={child._key || index}>{text}</strong>;
            case "em":
              return <em key={child._key || index}>{text}</em>;
            case "underline":
              return (
                <span key={child._key || index} className={styles.underline}>
                  {text}
                </span>
              );
            default:
              return text;
          }
        }, <Fragment key={child._key || index}>{child.text}</Fragment>);
      })}
    </Fragment>
  );
};

const renderListItem = (block: IBlock) => {
  const content = renderTextWithMarks(block.children, block.markDefs);

  return (
    <li
      key={block._key}
      className={cn(styles.listItem, josefin.className, {
        [styles.letter]: block.level > 1,
      })}
      style={{ marginLeft: `${block.level * 1.5}rem` }}
    >
      {content}
    </li>
  );
};

const renderNonListBlock = (block: IBlock) => {
  const content = renderTextWithMarks(block.children, block.markDefs);

  switch (block.style) {
    case "normal":
      return (
        <Paragraph
          key={block._key}
          level="regular"
          color="darkest-burgundy"
          paddingBottomArray={[2, 3, 3, 4]}
        >
          {content}
        </Paragraph>
      );
    case "blockquote":
      return (
        <Paragraph
          key={block._key}
          level="regular"
          color="burgundy"
          className={styles.blockquote}
        >
          {content}
        </Paragraph>
      );
    default:
      return (
        <Heading
          key={block._key}
          as={block.style}
          weight={400}
          level="6"
          color="burgundy"
          paddingBottomArray={[2]}
        >
          {content}
        </Heading>
      );
  }
};

export const contentBlocks = ({ blocks }: { blocks: IBlock[] }) => {
  const result: JSX.Element[] = [];
  let currentListItems: IBlock[] = [];
  let currentListType: "number" | "bullet" | null = null; // Track the current type of list (numbered or bullet)
  let currentLevel = 1; // Track the current level of the list

  const flushList = () => {
    if (currentListItems.length > 0) {
      if (currentListType === "number") {
        result.push(
          <ol
            key={`numbered-list-${currentListItems[0]._key}`}
            className={styles.numberedList}
          >
            {currentListItems.map((block) => renderListItem(block))}
          </ol>
        );
      } else if (currentListType === "bullet") {
        result.push(
          <ul
            key={`bulleted-list-${currentListItems[0]._key}`}
            className={styles.bulletedList}
          >
            {currentListItems.map((block) => renderListItem(block))}
          </ul>
        );
      }
      currentListItems = [];
      currentListType = null;
    }
  };

  blocks.forEach((block, index) => {
    if (block.listItem === "number" || block.listItem === "bullet") {
      // If switching list types or the level changes, flush the current list
      if (block.listItem !== currentListType || block.level !== currentLevel) {
        flushList();
        currentListType = block.listItem; // Update to the new list type
        currentLevel = block.level; // Update to the new level
      }

      currentListItems.push(block);
    } else {
      // If it's not a list item, flush the current list
      flushList();
      result.push(renderNonListBlock(block));
    }
  });

  // Flush any remaining list items
  flushList();

  return <>{result}</>;
};

export const renderBlocks = (block: IBlock) => {
  if (block.listItem === "number") {
    return renderListItem(block);
  }
  return renderNonListBlock(block);
};
