"use client";
import React, { FC } from "react";
import styles from "./Works.module.scss";
import cn from "classnames";
import FlexDiv from "../../../reuse/FlexDiv";
import { Heading } from "../../../reuse/Heading";
import { LocalPaths } from "../../../../data.d";
import {
  ICustomImage,
  SanityImage,
} from "../../../reuse/SanityImage/SanityImage";
import { getTranslations } from "../../../../helpers/langUtils";
import { useLocale } from "next-intl";
import { LangType } from "@/i18n/request";
import Link from "next/link";
import { TitleWrapper } from "../../../reuse/containers/TitleWrapper/TitleWrapper";
import { WorkPageProps } from "@/app/[locale]/portfolio/[projectType]/page";
import { AnimatedWrapper } from "@/components/reuse/AnimatedWrapper/AnimatedWrapper";
import { useGoogleEvent } from "@/app/api/sendGoogleEvent";
import { ReserveLabel } from "@/components/reuse/ReserveLabel/ReserveLabel";

export interface WorkProps {
  backgroundImage: ICustomImage;
  title: string;
  path: LocalPaths;
  reserve?: boolean;
}

const Work: FC<WorkProps> = ({ backgroundImage, title, path, reserve }) => {
  const locale = useLocale() as LangType;
  const translations = getTranslations(locale);
  const sendEvent = useGoogleEvent();

  return (
    <AnimatedWrapper from="inside">
      <Link
        href={`/${locale}${LocalPaths.PORTFOLIO}${path}`}
        key={path}
        className={styles.container}
        aria-label={title}
        onClick={() => sendEvent("Click Work", path)}
      >
        <SanityImage
          image={backgroundImage?.image}
          alt={backgroundImage?.alt}
          figureClassName={cn(styles.image)}
          quality={50}
        />

        <FlexDiv as="cite" className={styles.text}>
          <Heading
            as="h2"
            level="3"
            color="cream-white"
            weight={400}
            className={styles.title}
          >
            {title}
          </Heading>
          {reserve && <ReserveLabel className={styles.reserve} />}
        </FlexDiv>
      </Link>
    </AnimatedWrapper>
  );
};

export interface WorksProps {
  title?: boolean;
  worksData: WorkPageProps[];
}
export const Works: React.FC<WorksProps> = ({ worksData, title = true }) => {
  const locale = useLocale() as LangType;
  const translations = getTranslations(locale);
  const works: WorkProps[] = worksData.map((work) => {
    return {
      backgroundImage: work.hero.backgroundImage,
      path: work.path,
      title: work.hero.title.part1,
      reserve: work.reserve,
    };
  });
  const worksComp = (
    <FlexDiv gapArray={[6, 4, 5, 6]} width100 className={cn(styles.wrapper)}>
      {works.map((work) => {
        return <Work key={work.title} {...work} />;
      })}
    </FlexDiv>
  );
  return title ? (
    <TitleWrapper title={translations.titles.work}>{worksComp}</TitleWrapper>
  ) : (
    worksComp
  );
};
