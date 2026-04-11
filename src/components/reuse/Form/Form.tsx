import React, { PropsWithChildren, FC, ReactNode } from "react";

import styles from "./Form.module.scss";
import { Button } from "@/components/reuse/Button";
import FlexDiv from "../FlexDiv";
import { Heading } from "../Heading";
import { Alert } from "../Alert/Alert";
import { useWindowResize } from "@/helpers/useWindowResize";
import { StepProps } from "./formTypes";
import { Paragraph } from "../Paragraph/Paragraph";
import { Translations } from "@/langs/langTypes";
import { LangType } from "@/i18n/request";
import { LocalPaths } from "@/data.d";

export interface FormTitleProps {
  title: string;
  subTitle?: string;
  alignText?: "left" | "center";
}
export const FormTitles: FC<FormTitleProps> = ({
  title,
  subTitle,
  alignText = "center",
}) => {
  return (
    <FlexDiv
      width100
      flex={{
        direction: "column",
        x: alignText == "center" ? "center" : "flex-start",
      }}
      className={styles.formTitles}
    >
      <Heading
        as="h3"
        level="5"
        color="dark-burgundy"
        weight={400}
        textAlign={alignText}
      >
        {title}
      </Heading>
      {subTitle && (
        <Paragraph
          level="regular"
          color="burgundy"
          weight={400}
          textAlign={alignText}
        >
          {subTitle}
        </Paragraph>
      )}
    </FlexDiv>
  );
};
export const Step: FC<PropsWithChildren<StepProps>> = ({
  children,
  number,
}) => {
  return (
    <FlexDiv
      gapArray={[3, 3, 3, 4]}
      flex={{ y: "flex-start" }}
      width100
      className={styles.step}
      key={number}
    >
      {number && (
        <Heading
          as="h4"
          level="4"
          color="burgundy"
          weight={400}
          className={styles.number}
        >
          {number.toString()}
        </Heading>
      )}
      <FlexDiv
        gapArray={[3, 4]}
        flex={{ direction: "column" }}
        className={styles.stepContent}
      >
        {children}
      </FlexDiv>
    </FlexDiv>
  );
};

export const MultiColumn: FC<PropsWithChildren> = ({ children }) => {
  return (
    <FlexDiv gapArray={[3, 3, 3, 4]} width100 wrap>
      {children}
    </FlexDiv>
  );
};

export const FormSubmitButton: FC<{
  isValid: boolean;
  submitText: string | false;
  translations: Translations;
  loading: boolean;
}> = ({ isValid, translations, submitText, loading = true }) => {
  const { isMobile } = useWindowResize();

  return (
    <FlexDiv className={styles.submitWrapper} gapArray={[2]}>
      <Button type="submit" variant="primary">
        {translations.buttons.submit}
      </Button>
      {!isValid && (
        <Alert arrow={isMobile ? "bottom" : "left"}>
          {translations.form.general.requiredAlert}
        </Alert>
      )}
      {submitText && (
        <Alert arrow={isMobile ? "bottom" : "left"}>{submitText}</Alert>
      )}
      {loading && <div className={styles.spinner} />}
    </FlexDiv>
  );
};

export const FormSteps: FC<{
  steps: ReactNode[];
  stepNumbers?: boolean;
}> = ({ steps, stepNumbers = true }) => {
  return (
    <FlexDiv
      gapArray={[5, 5, 5, 5]}
      width100
      flex={{ direction: "column", x: "stretch", y: "flex-start" }}
    >
      {steps.map((step, index) => {
        if (index === 0) {
          return;
        } else {
          return (
            <Step key={index} number={stepNumbers ? index : undefined}>
              {step}
            </Step>
          );
        }
      })}
    </FlexDiv>
  );
};

export const FormSubmitMessage: FC<{
  locale: LangType;
  translations: Translations;
}> = ({ locale, translations }) => {
  return (
    <FlexDiv flex={{ direction: "column" }} gapArray={[4, 4, 4, 5]}>
      <Heading
        as="h3"
        level="4"
        color="burgundy"
        weight={500}
        textAlign="center"
      >
        {translations.form.general.emailSent}
      </Heading>{" "}
      <Button variant="transparent" path={`/${locale}${LocalPaths.HOME}`}>
        {translations.nav.home}
      </Button>
    </FlexDiv>
  );
};
