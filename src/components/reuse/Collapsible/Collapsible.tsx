"use client";
import React, { useState } from "react";
import styles from "./Collapsible.module.scss";

import FlexDiv from "../../reuse/FlexDiv";
import cn from "classnames";
import { Heading } from "../../reuse/Heading";
import { SizeType, TextWrapper } from "../containers/TextWrapper/TextWrapper";
import { Paragraph } from "../Paragraph/Paragraph";
import { Icon } from "../Icon";
import { PortableTextContent } from "../Paragraph/PortableTextContent";
import { useWindowResize } from "@/helpers/useWindowResize";

export interface CollapsibleProps {
  title?: string;
  questions: {
    question: string;
    answer: string;
  }[];
  variant?: SizeType;
  borderBottom?: boolean;
}
export const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  questions,
  variant = "big",
  borderBottom = true,
}) => {
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);
  const { isMobile } = useWindowResize();

  const toggleQuestion = (index: number) => {
    setOpenQuestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <TextWrapper version={borderBottom ? 3 : 4} variant={variant}>
      <FlexDiv
        flex={{ direction: "column", x: "flex-start", y: "flex-start" }}
        width100
        gapArray={[4]}
      >
        {title && (
          <Heading level="5" as="h4" color="dark-burgundy" weight={500}>
            {title}
          </Heading>
        )}
        <FlexDiv
          flex={{ direction: "column", x: "flex-start", y: "flex-start" }}
          width100
          gapArray={[4]}
        >
          {questions?.map((q, index) => (
            <FlexDiv
              key={index}
              width100
              flex={{ direction: "column", x: "flex-start", y: "flex-start" }}
            >
              <button
                className={styles.questionToggle}
                onClick={() => toggleQuestion(index)}
              >
                <Paragraph
                  level="big"
                  color="darkest-burgundy"
                  textAlign="left"
                >
                  {q.question}
                </Paragraph>

                <Icon
                  icon={openQuestions.includes(index) ? "minus" : "plus"}
                  size="small"
                  className={cn(
                    openQuestions.includes(index) ? styles.minus : styles.plus,
                  )}
                  key={openQuestions.includes(index) ? "minus" : "plus"}
                />
              </button>
              {openQuestions.includes(index) && (
                <FlexDiv
                  className={styles.answer}
                  padding={{ top: [3], left: [4], right: [8] }}
                  flex={{
                    direction: "column",
                    x: "flex-start",
                    y: "flex-start",
                  }}
                  gapArray={[2]}
                >
                  <PortableTextContent
                    level={isMobile ? "small" : "regular"}
                    value={q.answer}
                    color="burgundy"
                    weight={400}
                  />
                </FlexDiv>
              )}
            </FlexDiv>
          ))}
        </FlexDiv>
      </FlexDiv>
    </TextWrapper>
  );
};
