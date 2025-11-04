import React, { useRef } from "react";
import styles from "./DropDown.module.scss";
import FlexDiv from "../../reuse/FlexDiv";
import cn from "classnames";
import { ICta } from "../../../data.d";
import { Paragraph } from "../../reuse/Paragraph/Paragraph";
import { useAtom } from "jotai";
import { sidebarData } from "../Sidebar/Sidebar";
import Link from "next/link";
import { usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export interface DropDownProps {
  parentPath?: string;
  dropdown: ICta[];
  isOpen: boolean;
}
export const DropDown: React.FC<DropDownProps> = ({
  parentPath,
  dropdown,
  isOpen,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [, setSidebar] = useAtom(sidebarData);
  const pathname = usePathname();
  const locale = useLocale();

  if (!isOpen) return null;

  return (
    isOpen && (
      <FlexDiv
        flex={{ direction: "column", x: "flex-start" }}
        padding={{ vertical: [0, 0, 3, 3] }}
        className={cn(styles.dropdown)}
        ref={dropdownRef}
        as="ul"
      >
        {dropdown?.map((cta, index) => {
          const isActive =
            `/${locale}${pathname}` === `${parentPath}${cta.link?.join()}`;
          return (
            <Link
              key={index}
              href={`${parentPath}${cta.link?.join()!}`}
              onClick={() => setSidebar(false)}
              aria-label={cta.text}
            >
              <FlexDiv
                flex={{ x: "space-between" }}
                width100
                as="li"
                padding={{ vertical: [4, 4, 3], horizontal: [5] }}
                className={cn(styles.tab, { [styles.selected]: isActive })}
              >
                <Paragraph level="regular" color="dark-burgundy">
                  {cta.text}
                </Paragraph>
              </FlexDiv>
            </Link>
          );
        })}
      </FlexDiv>
    )
  );
};
