"use client";

import cn from "classnames";
import { useLocale } from "next-intl";

import { getTranslations } from "@/helpers/langUtils";
import { useWindowResize } from "@/helpers/useWindowResize";
import { LangType } from "@/i18n/request";
import FlexDiv from "../FlexDiv";
import { Paragraph } from "../Paragraph/Paragraph";
import styles from "./ReserveLabel.module.scss";

interface ReserveLabelProps {
  className?: string;
  size?: "responsive" | "regular";
  color?: "light" | "dark";
}

export const ReserveLabel: React.FC<ReserveLabelProps> = ({
  className,
  size = "responsive",
  color = "light",
}) => {
  const locale = useLocale() as LangType;
  const translations = getTranslations(locale);
  const { isMobileOrTablet } = useWindowResize();

  return (
    <FlexDiv
      padding={{ horizontal: [5], vertical: [3], bottom: [2] }}
      className={cn(styles.label, className, styles[color])}
    >
      <Paragraph
        level={size === "regular" || isMobileOrTablet ? "small" : "big"}
        color={color === "dark" ? "cream-white" : "burgundy"}
        weight={400}
      >
        {translations.other.reserve}
      </Paragraph>
    </FlexDiv>
  );
};
