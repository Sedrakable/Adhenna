"use client";
import React, { CSSProperties } from "react";
import FlexDiv from "../../../reuse/FlexDiv";

import { TextWrapper } from "../../../reuse/containers/TextWrapper/TextWrapper";
import { Paragraph } from "@/components/reuse/Paragraph/Paragraph";
import { Heading } from "@/components/reuse/Heading";
import { useWindowResize } from "@/helpers/useWindowResize";

export interface DescriptionProps {
  title: string;
  desc: string;
  textAlign?: CSSProperties["textAlign"];
}
export const Description: React.FC<DescriptionProps> = ({
  title,
  desc,
  textAlign,
}) => {
  return (
    <FlexDiv flex={{ direction: "column" }} gapArray={[3, 3, 3, 4]} width100>
      <Heading
        as="h5"
        level="5"
        color="burgundy"
        textAlign={textAlign}
        weight={500}
        width100
      >
        {title}
      </Heading>
      <Paragraph level="regular" color="darkest-burgundy" textAlign={textAlign}>
        {desc}
      </Paragraph>
    </FlexDiv>
  );
};

export interface MultiDescriptionProps {
  descs: DescriptionProps[];
  textAlign?: CSSProperties["textAlign"];
  desktopVertical?: boolean;
}
export const MultiDescription: React.FC<MultiDescriptionProps> = ({
  descs,
  textAlign = "center",
  desktopVertical,
}) => {
  const { isMobile, isDesktop } = useWindowResize();
  return (
    <TextWrapper>
      <FlexDiv
        gapArray={[7, 7, 7, 8]}
        flex={{
          direction:
            isMobile || (desktopVertical && isDesktop) ? "column" : "row",
          y: desktopVertical && isDesktop ? "stretch" : "flex-start",
        }}
      >
        {descs.map((desc, key) => (
          <Description key={key} {...desc} textAlign={textAlign} />
        ))}
      </FlexDiv>
    </TextWrapper>
  );
};
