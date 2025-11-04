"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.scss";
import TabButton from "../TabButton/TabButton";
import { useWindowResize } from "../../../helpers/useWindowResize";
import { IconButton } from "../../reuse/IconButton";
import cn from "classnames";
import FlexDiv from "../../reuse/FlexDiv";
// import Logo from "@/assets/vector/EyeLogo.svg";
import Logo from "../../../assets/vector/EyeLogo.svg";
import { Button } from "../../reuse/Button";
import { ICta, INavLink, ISocials, LocalPaths } from "../../../data.d";
import { useAtom } from "jotai";
import { getTranslations } from "../../../helpers/langUtils";
import { Translations } from "@/langs/langTypes";
import { sidebarData } from "../Sidebar/Sidebar";
import Link from "next/link";
import { useLocale } from "next-intl";
import { LangType } from "@/i18n/request";
import dynamic from "next/dynamic";
import { Socials } from "@/components/footer/Socials";
import { useGoogleEvent } from "@/app/api/sendGoogleEvent";
import { LangSwitcher } from "../LangSwitcher/LangSwitcher";

const Sidebar = dynamic(
  () => import("../Sidebar/Sidebar").then((module) => module.Sidebar),
  {
    ssr: false,
  }
);

export const isCta = (link: INavLink | ICta): link is ICta => {
  return (link as INavLink).ctaArray == undefined;
};

//FIX: Make titles hardcoded text. FR and EN
const links = (trans: Translations): (INavLink | ICta)[] => {
  return [
    {
      text: trans.nav.services,
      link: LocalPaths.SERVICE,
      ctaArray: [
        { text: trans.nav.tattoo, link: [LocalPaths.TATTOO] },
        { text: trans.nav.henna, link: [LocalPaths.HENNA] },
        {
          text: trans.nav.testTattoo,
          link: [LocalPaths.TEST_TATTOO],
        },
      ],
    } as INavLink,
    {
      text: trans.nav.courses,
      link: LocalPaths.COURSE,
      ctaArray: [
        { text: trans.nav.online, link: [LocalPaths.ONLINE] },
        { text: trans.nav.inPerson, link: [LocalPaths.IN_PERSON] },
      ],
    } as INavLink,
    {
      text: trans.nav.portfolio,
      link: [LocalPaths.PORTFOLIO],
    } as ICta,
    { text: trans.nav.boutique, link: [LocalPaths.BOUTIQUE] } as ICta,
    { text: trans.nav.blog, link: [LocalPaths.BLOG] } as ICta,
  ];
};

interface NavbarProps {
  socials: ISocials;
}
export const Navbar: FC<NavbarProps> = ({ socials }) => {
  const { isMobile, isMobileOrTablet } = useWindowResize();
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const locale = useLocale() as LangType;
  const translations = getTranslations(locale);
  const [sidebar, setSidebar] = useAtom(sidebarData);
  const sendEvent = useGoogleEvent();

  useEffect(() => {
    const handleScroll = () => {
      const offset = navRef?.current?.clientHeight!;
      const isScrolled = window.scrollY > offset;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navRef]);

  return (
    <>
      <nav
        className={cn(styles.navbarWrapper, { [styles.scrolled]: scrolled })}
        ref={navRef}
      >
        <FlexDiv
          className={styles.navbar}
          flex={{ x: "space-between", y: "center" }}
          height100
          padding={{ horizontal: [5, 6, 7, 8] }}
        >
          <LogoLink locale={locale} />

          <FlexDiv
            flex={{ x: "space-between", y: "center" }}
            gapArray={[6, 6, 7, 7]}
          >
            {!isMobile && (
              <FlexDiv gapArray={[6]} as="ul">
                {links(translations)?.map((link: INavLink | ICta, key) => {
                  return (
                    !isMobileOrTablet &&
                    (isCta(link) ? (
                      <li key={key}>
                        <TabButton
                          className={styles.tab}
                          path={`/${locale}${link.link!.join("")}`}
                        >
                          {link.text}
                        </TabButton>
                      </li>
                    ) : (
                      <li key={key}>{dropDown(link, locale, key)}</li>
                    ))
                  );
                })}
              </FlexDiv>
            )}

            <FlexDiv gapArray={[5]}>
              {!isMobile && (
                <Button
                  variant="extra"
                  path={`/${locale}${LocalPaths.CART}`}
                  iconProps={{ icon: "cart" }}
                  aria-label={translations.nav.cart}
                  onClick={() =>
                    sendEvent("Click Navbar Cart", LocalPaths.CART)
                  }
                />
              )}

              <Button
                variant="primary"
                path={`/${locale}${LocalPaths.CONTACT}`}
                onClick={() =>
                  sendEvent("Click Navbar Contact", LocalPaths.CONTACT)
                }
              >
                {translations.nav.contact}
              </Button>

              {!isMobile && <LangSwitcher />}
              {!isMobileOrTablet && <Socials {...socials} />}
            </FlexDiv>

            {isMobileOrTablet && (
              <IconButton
                onClick={() => setSidebar(true)}
                iconProps={{ icon: "burger", size: "large" }}
                aria-label="burger menu"
              />
            )}
          </FlexDiv>
        </FlexDiv>
      </nav>
      {isMobileOrTablet && sidebar && (
        <Sidebar links={links(translations)} lang={locale} socials={socials} />
      )}
    </>
  );
};

// Helper components
export const LogoLink: React.FC<{ locale: LangType; light?: boolean }> = ({
  locale,
  light = false,
}) => {
  const translations = getTranslations(locale);
  const [, setSidebar] = useAtom(sidebarData);
  const sendEvent = useGoogleEvent();

  return (
    <Link
      href={`/${locale}${LocalPaths.HOME}`}
      className={cn(styles.logo, { [styles.light]: light })}
      aria-label={translations.nav.home}
      onClick={() => {
        setSidebar(false), sendEvent("Click Logo", LocalPaths.HOME);
      }}
    >
      <Logo />
    </Link>
  );
};

export const dropDown = (navLink: INavLink, locale: LangType, key?: number) => (
  <TabButton
    key={key}
    className={styles.tab}
    path={`/${locale}${navLink.link}`}
    dropdown={navLink.ctaArray}
  >
    {navLink.text}
  </TabButton>
);
