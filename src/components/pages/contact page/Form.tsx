"use client";
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import styles from "./Form.module.scss";
import cn from "classnames";
import { Button } from "../../reuse/Button";
import FlexDiv from "../../reuse/FlexDiv";
import { useWindowResize } from "../../../helpers/useWindowResize";
import { IForm } from "../../../data.d";
import { getTranslations } from "../../../helpers/langUtils";
import { Heading } from "../../reuse/Heading";
import { useLocale } from "next-intl";
import { LangType } from "@/i18n";

export const Form: React.FC<IForm> = ({ desc }) => {
  const form = useRef<HTMLFormElement>(null);
  const [budget, setBudget] = useState<string>("");
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [formValid, setFormValid] = useState<boolean>(false);

  const locale = useLocale() as LangType;
  const translations = getTranslations(locale);

  const { isMobileOrTablet, isLaptop } = useWindowResize();

  const handleBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numericValue = value.replace(/[^0-9.]/g, "");
    // Ensure that only numeric characters are entered
    setBudget(`CAD ${numericValue}`);
  };

  const sendEmail = (e: any) => {
    e.preventDefault();
    if (!formValid) {
      // If form is not valid, display error message
      alert("Please fill out all required fields.");
      return;
    }
    emailjs
      .sendForm("gmail", "contact-seto", form.current!, "bVxK7PZwLIutCAifw")
      .then(
        () => {
          setEmailSent(true);
        },
        (error) => {
          console.error("didint work", error);
        }
      );
  };
  const handleKeyDown = (e: any) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleInputChange = () => {
    // Check if all required fields are filled
    const requiredInputs = form.current?.querySelectorAll<HTMLInputElement>(
      "input[required]"
    );
    const requiredTextareas = form.current?.querySelectorAll<
      HTMLTextAreaElement
    >("textarea[required]");
    const allRequiredFieldsFilled =
      Array.from(requiredInputs || []).every(
        (input: HTMLInputElement) => input.value.trim() !== ""
      ) &&
      Array.from(requiredTextareas || []).every(
        (textarea: HTMLTextAreaElement) => textarea.value.trim() !== ""
      );
    setFormValid(allRequiredFieldsFilled);
  };

  return (
    <FlexDiv
      width100
      flex={{
        direction: isMobileOrTablet || isLaptop ? "column" : "row",
        y: "flex-start",
      }}
      gapArray={[4]}
    >
      {emailSent ? (
        <FlexDiv
          padding={{ horizontal: [6], vertical: [4] }}
          className={styles.emailSent}
        >
          <Heading as="h2" level="1" font="Seto" color="white">
            {translations.form.sent}
          </Heading>
        </FlexDiv>
      ) : (
        <>
          <form
            ref={form}
            className={cn(styles.form, styles.contactForm)}
            onSubmit={sendEmail}
          >
            <div className={styles.info}>
              <input
                type="text"
                name="user_name"
                required
                placeholder={translations.form.name}
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="user_email"
                required
                placeholder={translations.form.email}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.info}>
              <input
                type="text"
                name="company_name"
                placeholder={translations.form.companyName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="budget"
                placeholder={translations.form.budget}
                onChange={handleBudgetChange}
                value={budget}
              />
            </div>

            <textarea
              onKeyDown={handleKeyDown}
              onChange={handleInputChange}
              name="message"
              placeholder={translations.form.message}
              required
            />

            <Button variant="fancy" disabled={!formValid}>
              {translations.buttons.send}
            </Button>
          </form>
        </>
      )}
    </FlexDiv>
  );
};
