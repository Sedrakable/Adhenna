import React from "react";
import styles from "./Sidebar.module.scss";
import { IconButton } from "../../reuse/IconButton";
import cn from "classnames";
import FlexDiv from "../../reuse/FlexDiv";
import { Button } from "../../reuse/Button";
import { ICta, INavLink, ISocials, LocalPaths } from "../../../data.d";
import { atom, useAtom } from "jotai";
import { getTranslations } from "../../../helpers/langUtils";
import { LogoLink, dropDown, isCta } from "../Navbar/Navbar";
import TabButton from "../TabButton/TabButton";
import { LangType } from "@/i18n/request";
import { useLocale } from "next-intl";
import { Socials } from "@/components/footer/Socials";
import { useGoogleEvent } from "@/app/api/sendGoogleEvent";
import { LangSwitcher } from "../LangSwitcher/LangSwitcher";
import { useWindowResize } from "@/helpers/useWindowResize";

export const sidebarData = atom<boolean>(false);

interface SidebarProps {
  links: (INavLink | ICta)[];
  lang: LangType;
  socials: ISocials;
}
export const Sidebar: React.FC<SidebarProps> = ({ links, lang, socials }) => {
  const { isMobile } = useWindowResize();
  const [sidebar, setSidebar] = useAtom(sidebarData);
  const locale = useLocale() as LangType;
  const translations = getTranslations(locale);
  const sendEvent = useGoogleEvent();

  const tabWrapper = (
    child: React.ReactNode,
    onClick?: () => void,
    key?: number
  ) => (
    <FlexDiv
      key={key}
      className={styles.tabWrapper}
      flex={{ x: "flex-start" }}
      padding={{ horizontal: [4, 4, 0, 0], vertical: [3] }}
      onClick={() => onClick && onClick()}
      as="li"
    >
      {child}
    </FlexDiv>
  );

  return (
    <div className={cn(styles.sidebar, { [styles.isOpen]: sidebar })}>
      <FlexDiv
        className={styles.closeTab}
        width100
        flex={{ x: "space-between" }}
        padding={{ horizontal: [5, 6, 7, 8] }}
      >
        <LogoLink locale={locale} light />

        <IconButton
          onClick={() => setSidebar(false)}
          iconProps={{
            icon: "close",
            size: "large",
            color: "light_burgundy",
          }}
          aria-label="close sidebar"
        />
      </FlexDiv>
      <div className={styles.overlay} onClick={() => setSidebar(false)} />
      <FlexDiv
        className={styles.tabs}
        flex={{ direction: "column", x: "flex-start", y: "stretch" }}
        width100
        height100
        as="ul"
      >
        {links?.map((link: INavLink | ICta, key) => {
          return isCta(link)
            ? tabWrapper(
                <TabButton
                  className={styles.tab}
                  path={`/${locale}${link.link!.join("")}`}
                  onClick={() => setSidebar(false)}
                >
                  {link.text}
                </TabButton>,
                undefined,
                key
              )
            : tabWrapper(
                dropDown(link, lang),
                () => sendEvent("Click Dropdown", link.link),
                key
              );
        })}
        <FlexDiv
          className={styles.bottom}
          flex={{ direction: "column", x: "flex-start", y: "flex-start" }}
          width100
          height100
        >
          {tabWrapper(
            <FlexDiv
              flex={{ direction: "row", x: "flex-start" }}
              gapArray={[4]}
              width100
              padding={{ vertical: [3] }}
            >
              {isMobile && <LangSwitcher onClick={() => setSidebar(false)} />}
              <Button
                variant="extra"
                path={`/${locale}${LocalPaths.CART}`}
                iconProps={{ icon: "cart" }}
                onClick={() => sendEvent("Click Cart", LocalPaths.CART)}
              />

              <Button
                variant="primary"
                path={`/${locale}${LocalPaths.CONTACT}`}
                onClick={() => sendEvent("Click Contact", LocalPaths.CONTACT)}
              >
                {translations.nav.contact}
              </Button>
            </FlexDiv>,
            () => setSidebar(false)
          )}
          {tabWrapper(
            <FlexDiv
              flex={{ direction: "row", x: "space-between", y: "center" }}
              width100
              padding={{ vertical: [3] }}
            >
              <Socials {...socials} />
            </FlexDiv>
          )}
        </FlexDiv>
      </FlexDiv>
    </div>
  );
};
