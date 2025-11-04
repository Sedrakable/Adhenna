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
import {
  HTMLMotionProps,
  motion,
  useAnimationControls,
  Variants,
} from "motion/react";

export interface ContactProps {
  form: ContactFormProps;
  images: FloatingImages;
  locale: LangType;
}

export const Contact: FC<ContactProps> = ({ form, images, locale }) => {
  const trans = getTranslations(locale);
  const [submitted, setSubmitted] = useState<boolean>(false); // Fixed typo: sumbmited -> submitted
  const messageRef = useRef<HTMLDivElement>(null); // Ref for FormSubmitMessage
  const controls = useAnimationControls(); // Animation controls

  // Animation variants for FormSubmitMessage
  const variants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Scroll and animate when submitted changes to true
  useEffect(() => {
    if (submitted && messageRef.current) {
      // Start the animation
      controls.start("visible");

      // Scroll to center the FormSubmitMessage
      messageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center", // Centers the element vertically in the viewport
      });
    }
  }, [submitted, controls]);

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
          initial="hidden"
          animate={controls}
          variants={variants}
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
