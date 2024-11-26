"use client";
import React, { useState } from "react";
import styles from "./Collapsible.module.scss";

import FlexDiv from "../../reuse/FlexDiv";
import cn from "classnames";
import { Heading } from "../../reuse/Heading";
import { SizeType, TextWrapper } from "../containers/TextWrapper/TextWrapper";
import { Paragraph } from "../Paragraph/Paragraph";
import { Icon } from "../Icon";

export interface CollapsibleProps {
  title?: string;
  questions: {
    question: string;
    answer: string;
  }[];
  variant?: SizeType;
}
export const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  questions,
  variant = "big",
}) => {
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);

  const toggleQuestion = (index: number) => {
    setOpenQuestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <TextWrapper version={3} variant={variant}>
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
                  level="regular"
                  color="darkest-burgundy"
                  textAlign="left"
                >
                  {q.question}
                </Paragraph>

                <Icon
                  icon={openQuestions.includes(index) ? "minus" : "plus"}
                  size="small"
                  className={cn(
                    openQuestions.includes(index) ? styles.minus : styles.plus
                  )}
                  key={openQuestions.includes(index) ? "minus" : "plus"}
                />
              </button>
              {openQuestions.includes(index) && (
                <FlexDiv
                  className={styles.answer}
                  padding={{ top: [3], left: [4], right: [8] }}
                >
                  <Paragraph level="small" color="burgundy" weight={500}>
                    {q.answer}
                  </Paragraph>
                </FlexDiv>
              )}
            </FlexDiv>
          ))}
        </FlexDiv>
      </FlexDiv>
    </TextWrapper>
  );
};
