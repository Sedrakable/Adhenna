"use client";
import React, { FC } from "react";
import styles from "./Footer.module.scss"; // Create this in a similar way to Navbar.module.scss
import Logo from "@/assets/vector/AdhennaFullLogo.svg";
import { Socials } from "../footer/Socials"; // Socials component you already have
import Link from "next/link";
import { useLocale } from "next-intl";
import { LangType } from "@/i18n/request";
import { ICta, INavLink, IOpeningHours, ISocials, LocalPaths } from "@/data.d";
import { getTranslations } from "@/helpers/langUtils";
import FlexDiv from "../reuse/FlexDiv";
import { Paragraph } from "../reuse/Paragraph/Paragraph";
import { Heading } from "../reuse/Heading";
import { Translations } from "@/langs/langTypes";
import { Line } from "../reuse/Line";
import { useWindowResize } from "@/helpers/useWindowResize";
import { Icon } from "../reuse/Icon";

const legalLinks = (trans: Translations): (INavLink | ICta)[] => {
  return [
    {
      text: trans.nav.policies,
      link: [LocalPaths.LEGAL, LocalPaths.POLICIES],
    } as ICta,
    {
      text: trans.nav.privacy,
      link: [LocalPaths.LEGAL, LocalPaths.PRIVACY],
    } as ICta,
    {
      text: trans.nav.terms,
      link: [LocalPaths.LEGAL, LocalPaths.TERMS],
    } as ICta,
  ];
};

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
      link: LocalPaths.PORTFOLIO,
      ctaArray: [
        { text: trans.nav.tattoo, link: [LocalPaths.TATTOO] },
        { text: trans.nav.flash, link: [LocalPaths.FLASH] },
        { text: trans.nav.henna, link: [LocalPaths.HENNA] },
        { text: trans.nav.toiles, link: [LocalPaths.TOILES] },
      ],
    } as INavLink,
    {
      text: trans.nav.other,
      ctaArray: [
        { text: trans.nav.boutique, link: [LocalPaths.BOUTIQUE] },
        { text: trans.nav.blog, link: [LocalPaths.BLOG] },
        { text: trans.nav.cart, link: [LocalPaths.CART] },
        { text: trans.nav.contact, link: [LocalPaths.CONTACT] },
      ],
    } as INavLink,
  ];
};

const LogoWrapper: FC<{ locale: LangType }> = ({ locale }) => {
  const trans = getTranslations(locale);
  return (
    <FlexDiv
      flex={{ direction: "column", y: "flex-start" }}
      className={styles.logo}
      gapArray={[4]}
    >
      <Link href={`/${locale}${LocalPaths.HOME}`} aria-label={trans.nav.home}>
        <Logo className={styles.logomark} />
      </Link>
      <Paragraph level="small" textAlign="center">
        © {new Date().getFullYear()} Adhenna
      </Paragraph>
    </FlexDiv>
  );
};

const SiteMap: FC<{ locale: LangType }> = ({ locale }) => {
  const trans = getTranslations(locale);
  return (
    <FlexDiv
      className={styles.siteMap}
      flex={{ y: "flex-start", x: "flex-end" }}
      wrap
      width100
      gapArray={[6, 8]}
    >
      {links(trans).map((link, index) => (
        <FlexDiv
          flex={{ direction: "column", x: "flex-end" }}
          key={index}
          gapArray={[4]}
        >
          {link.link ? (
            <Link href={`/${locale}${link.link}`}>
              <Heading level="6" as="h2" weight={400} color="cream-white">
                {link.text}
              </Heading>
            </Link>
          ) : (
            <Heading level="6" as="h2" weight={400} color="cream-white">
              {link.text}
            </Heading>
          )}
          {"ctaArray" in link && (
            <>
              {link.ctaArray.map((subLink, subIndex) => (
                <Link
                  href={`/${locale}${link?.link ? link.link : ""}${
                    subLink.link
                  }`}
                  key={subIndex}
                >
                  <Paragraph
                    level="big"
                    color="cream-white"
                    weight={300}
                    textAlign="left"
                  >
                    {subLink.text}
                  </Paragraph>
                </Link>
              ))}
            </>
          )}
        </FlexDiv>
      ))}
    </FlexDiv>
  );
};

const Legal: FC<{ locale: LangType }> = ({ locale }) => {
  const trans: Translations = getTranslations(locale);
  return (
    <FlexDiv
      className={styles.legalLinks}
      gapArray={[6]}
      wrap
      padding={{ vertical: [4, 0], horizontal: [6, 0] }}
    >
      {legalLinks(trans).map((link: ICta, index) => (
        <Link href={`/${locale}${link.link!.join("")}`} key={index}>
          <Paragraph level="small" color="light-burgundy">
            {link.text}
          </Paragraph>
        </Link>
      ))}
      <a
        href="https://www.setoxarts.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FlexDiv gapArray={[2]} flex={{ y: "flex-start" }}>
          <Paragraph level="small" color="light-burgundy">
            {`${trans.nav.madeBy} -`}
          </Paragraph>

          <Icon icon="setoxArts" color="cream_white" size="small" />
        </FlexDiv>
      </a>
    </FlexDiv>
  );
};

const Hours: FC<{ trans: Translations; openingHours: IOpeningHours }> = ({
  trans,
  openingHours,
}) => {
  return (
    <FlexDiv
      gapArray={[3]}
      flex={{ direction: "column", x: "flex-start", y: "flex-start" }}
      className={styles.hoursContainer}
      padding={{ horizontal: [4], top: [4], bottom: [3] }}
    >
      <Heading level="6" as="h3" weight={400} color="cream-white">
        {trans.hours.title}
      </Heading>
      <FlexDiv
        gapArray={[4]}
        flex={{ direction: "column", x: "stretch" }}
        className={styles.hours}
        width100
      >
        {openingHours.hours.map((day, index) => (
          <FlexDiv gapArray={[4]} key={index} flex={{ x: "space-between" }}>
            <Paragraph level="big" color="light-burgundy" weight={300}>
              {trans.hours[day.dayOfweek] + ":"}
            </Paragraph>
            <Paragraph level="big" color="cream-white" weight={300}>
              {`${day.startTime} ${trans.hours.to} ${day.endTime}`}
            </Paragraph>
          </FlexDiv>
        ))}
      </FlexDiv>
    </FlexDiv>
  );
};
interface FooterProps {
  socials: ISocials;
  openingHours: IOpeningHours;
}

export const DesktopFooter: FC<FooterProps> = ({ socials, openingHours }) => {
  const locale = useLocale() as LangType;
  const trans = getTranslations(locale);
  return (
    <FlexDiv
      className={styles.desktopContainer}
      flex={{ x: "space-between", y: "stretch" }}
      width100
      padding={{ horizontal: [6, 8, 9, 10], vertical: [7, 6, 6, 7] }}
      gapArray={[0, 6, 7, 8]}
    >
      <LogoWrapper locale={locale} />
      <FlexDiv
        className={styles.content}
        flex={{ x: "flex-end", y: "stretch" }}
        width100
        gapArray={[0, 7, 7, 8]}
      >
        <FlexDiv
          className={styles.left}
          flex={{ y: "space-between", x: "flex-end", direction: "column" }}
          width100
          padding={{ vertical: [0, 4] }}
          gapArray={[5]}
        >
          <SiteMap locale={locale} />
          <FlexDiv
            className={styles.bottom}
            flex={{ x: "flex-end", y: "flex-end" }}
            width100
            gapArray={[4, 5]}
          >
            <Socials {...socials} />
            <Legal locale={locale} />
          </FlexDiv>
        </FlexDiv>
        <Line color="light-burgundy-30" rotation="vertical" />
        <Hours trans={trans} openingHours={openingHours} />
      </FlexDiv>
    </FlexDiv>
  );
};

export const TabletFooter: FC<FooterProps> = ({ socials, openingHours }) => {
  const locale = useLocale() as LangType;
  const trans = getTranslations(locale);
  return (
    <FlexDiv
      className={styles.tabletContainer}
      flex={{ x: "center", y: "stretch" }}
      width100
      padding={{ horizontal: [6, 8, 9, 10], vertical: [7, 6, 6, 7] }}
      gapArray={[6]}
      wrap
    >
      <FlexDiv
        className={styles.left}
        flex={{ y: "space-between", direction: "column" }}
        padding={{ top: [4] }}
        gapArray={[4]}
      >
        <LogoWrapper locale={locale} />
        <Socials {...socials} />
      </FlexDiv>
      <FlexDiv
        className={styles.right}
        flex={{ x: "center", y: "space-between", direction: "column" }}
        gapArray={[7]}
      >
        <FlexDiv
          className={styles.content}
          flex={{ x: "center", y: "stretch" }}
          gapArray={[7]}
          padding={{ top: [4] }}
        >
          <FlexDiv
            className={styles.left}
            flex={{ y: "space-between", x: "flex-end", direction: "column" }}
            padding={{ vertical: [4] }}
            gapArray={[4]}
          >
            <SiteMap locale={locale} />
          </FlexDiv>
          <Line color="light-burgundy-30" rotation="vertical" />
          <FlexDiv
            flex={{ x: "space-between", y: "flex-start" }}
            padding={{ vertical: [4] }}
          >
            <Hours trans={trans} openingHours={openingHours} />
          </FlexDiv>
        </FlexDiv>
        <Legal locale={locale} />
      </FlexDiv>
    </FlexDiv>
  );
};

export const MobileFooter: FC<FooterProps> = ({ socials, openingHours }) => {
  const locale = useLocale() as LangType;
  const trans = getTranslations(locale);
  return (
    <FlexDiv
      className={styles.mobileContainer}
      flex={{ direction: "column" }}
      width100
      padding={{ horizontal: [6], top: [7], bottom: [8] }}
      gapArray={[7]}
    >
      <LogoWrapper locale={locale} />
      <Socials {...socials} />
      <SiteMap locale={locale} />
      <Line color="light-burgundy-30" rotation="horizontal" />
      <Hours trans={trans} openingHours={openingHours} />
      <Legal locale={locale} />
    </FlexDiv>
  );
};
export const Footer: FC<FooterProps> = (props) => {
  const { isMobile, isTablet } = useWindowResize();
  return (
    <footer className={styles.footer}>
      {isMobile ? (
        <MobileFooter {...props} />
      ) : isTablet ? (
        <TabletFooter {...props} />
      ) : (
        <DesktopFooter {...props} />
      )}
    </footer>
  );
};

export default Footer;
