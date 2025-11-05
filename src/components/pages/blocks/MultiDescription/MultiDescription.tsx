"use client";
import React, { CSSProperties } from "react";
import FlexDiv from "../../../reuse/FlexDiv";

import { TextWrapper } from "../../../reuse/containers/TextWrapper/TextWrapper";
import { Heading } from "@/components/reuse/Heading";
import { useWindowResize } from "@/helpers/useWindowResize";
import { ICta } from "@/data.d";
import { Button } from "@/components/reuse/Button";
import { useLocale } from "next-intl";
import { LangType } from "@/i18n/request";
import { PortableTextContent } from "@/components/reuse/Paragraph/PortableTextContent";

export interface DescriptionProps {
  title: string;
  desc: any;
  textAlign?: CSSProperties["textAlign"];
  cta?: ICta;
}
export const Description: React.FC<DescriptionProps> = ({
  title,
  desc,
  textAlign,
  cta,
}) => {
  const locale = useLocale() as LangType;
  return (
    <FlexDiv flex={{ direction: "column" }} gapArray={[2, 2, 2, 3]} width100>
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
      <PortableTextContent
        value={desc}
        color="darkest-burgundy"
        textAlign={textAlign}
        weight={400}
        level="regular"
      />
      {cta && (
        <Button variant="primary" path={`/${locale}${cta?.link?.join("")}`}>
          {cta?.text}
        </Button>
      )}
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
        gapArray={[6, 6, 6, 7]}
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
