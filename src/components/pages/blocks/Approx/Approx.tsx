"use client";
import React, { FC, useState, useRef, useEffect } from "react";
import styles from "./Approx.module.scss";
import cn from "classnames";
import FlexDiv from "../../../reuse/FlexDiv";
import {
  FloatingImages,
  FloatingImageWrapper,
} from "@/components/reuse/Form/FloatingImageWrapper/FloatingImageWrapper";
import { ApproxForm } from "@/components/reuse/Form/ApproxForm/ApproxForm";
import {
  FormTitleProps,
  FormSubmitMessage,
} from "@/components/reuse/Form/Form";
import { LangType } from "@/i18n/request";
import { motion, useAnimationControls, Variants } from "motion/react";
import { getTranslations } from "@/helpers/langUtils";

export interface ApproxProps {
  form: FormTitleProps;
  images: FloatingImages;
  plan: string;
  locale: LangType; // Added locale prop to match Contact
}

export const Approx: FC<ApproxProps> = ({ form, images, plan, locale }) => {
  const trans = getTranslations(locale);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();

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
      controls.start("visible");
      messageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
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
          <ApproxForm {...form} plan={plan} onSubmit={setSubmitted} />
        </FloatingImageWrapper>
      )}
    </FlexDiv>
  );
};
