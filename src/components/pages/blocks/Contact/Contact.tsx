"use client";
import React, { FC, useState, useRef, useEffect } from "react";
import styles from "./Contact.module.scss";
import cn from "classnames";
import FlexDiv from "../../../reuse/FlexDiv";
import { getTranslations } from "@/helpers/langUtils";
import {
  ContactForm,
  ContactFormProps,
} from "@/components/reuse/Form/ContactForm/ContactForm";
import {
  FloatingImages,
  FloatingImageWrapper,
} from "@/components/reuse/Form/FloatingImageWrapper/FloatingImageWrapper";
import { FormSubmitMessage } from "@/components/reuse/Form/Form";
import { LangType } from "@/i18n/request";
import { motion } from "motion/react";

export interface ContactProps {
  form: ContactFormProps;
  images: FloatingImages;
  locale: LangType;
}

export const Contact: FC<ContactProps> = ({ form, images, locale }) => {
  const trans = getTranslations(locale);
  const [submitted, setSubmitted] = useState<boolean>(false); // Fixed typo: sumbmited -> submitted
  const messageRef = useRef<HTMLDivElement>(null); // Ref for FormSubmitMessage

  // Scroll and animate when submitted changes to true
  useEffect(() => {
    if (submitted && messageRef.current) {
      // Scroll to center the FormSubmitMessage
      messageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center", // Centers the element vertically in the viewport
      });
    }
  }, [submitted]);

  return (
    <FlexDiv
      gapArray={[7, 7, 7, 8]}
      width100
      className={cn(styles.container)}
      flex={{ direction: "column" }}
    >
      {submitted ? (
        <motion.div
          ref={messageRef}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <FormSubmitMessage locale={locale} translations={trans} />
        </motion.div>
      ) : (
        <FloatingImageWrapper
          images={images}
          title={form.title}
          subTitle={form.subTitle}
        >
          <ContactForm {...form} onSubmit={setSubmitted} />
        </FloatingImageWrapper>
      )}
    </FlexDiv>
  );
};
