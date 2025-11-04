import React, { FC, ReactNode, useState } from "react";

import { usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Input, TextArea } from "@/components/reuse/Form/Input/Input";
import { getTranslations } from "@/helpers/langUtils";
import { LangType } from "@/i18n/request";
import styles from "../Form.module.scss";
import {
  MultiColumn,
  FormSubmitButton,
  FormTitles,
  FormTitleProps,
  FormSubmitMessage,
  FormSteps,
} from "../Form";
import { FlashFormData, FormErrorData } from "../formTypes";
import FlexDiv from "../../FlexDiv";

export interface FlashFormProps {
  flashFormData?: FormTitleProps;
  selectedFlash: string;
}

export const FlashForm: FC<FlashFormProps> = ({
  flashFormData,
  selectedFlash,
}) => {
  const locale = useLocale() as LangType;
  const translations = getTranslations(locale);

  const pathname = usePathname();
  // If you need the full URL (including origin)
  const currentUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${locale}${pathname}`
      : pathname;

  const [formData, setFormData] = useState<FlashFormData>({
    firstName: "",
    lastName: "",
    email: "",
    selectedFlash,
    bodyPosition: "",
    availabilities: "",
    additionalComments: "",
  });

  const [errors, setErrors] = useState<FormErrorData>({});
  const [submit, setSubmit] = useState<string | false>(false);
  const [loading, setLoading] = useState(false); // New loading state

  const handleInputChange = (field: keyof FlashFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrorData = {};
    const requiredFields: (keyof FlashFormData)[] = [
      "firstName",
      "lastName",
      "email",
      "selectedFlash",
      "bodyPosition",
      "availabilities",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = true;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/sendFlashFormEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData, currentUrl }),
      });

      if (response.ok) {
        setSubmit(translations.form.general.emailSent);
        // Add success handling (e.g., show success message, reset form)
      } else {
        console.error("Failed to send flash request", response);
        setSubmit(translations.form.general.emailNotSent);
        // Add error handling (e.g., show error message)
      }
    } catch (error) {
      console.error("Error:", error);
      setSubmit(translations.form.general.emailNotSent);
      // Add error handling
    } finally {
      setLoading(false); // Set loading to false after submission
    }
  };

  const Steps: ReactNode[] = [
    <MultiColumn>
      <Input
        label={translations.form.general.firstName}
        onChange={handleInputChange("firstName")}
        required
        value={formData.firstName}
        type="text"
        isInvalid={errors.firstName}
        placeholder={translations.form.general.firstNamePlaceholder}
      />
      <Input
        label={translations.form.general.lastName}
        onChange={handleInputChange("lastName")}
        required
        value={formData.lastName}
        type="text"
        isInvalid={errors.lastName}
        placeholder={translations.form.general.lastNamePlaceholder}
      />
    </MultiColumn>,
    <Input
      label={translations.form.general.email}
      type="email"
      value={formData.email}
      onChange={handleInputChange("email")}
      required
      isInvalid={errors.email}
      placeholder={translations.form.general.emailPlaceholder}
    />,
    <TextArea
      label={translations.form.flash.bodyPosition}
      value={formData.bodyPosition}
      onChange={handleInputChange("bodyPosition")}
      required
      isInvalid={errors.bodyPosition}
      placeholder={translations.form.flash.bodyPositionPlaceholder}
    />,
    <TextArea
      label={translations.form.general.availabilities}
      value={formData.availabilities}
      onChange={handleInputChange("availabilities")}
      required
      isInvalid={errors.availabilities}
      placeholder={translations.form.general.availabilitiesPlaceholder}
    />,
    <TextArea
      label={translations.form.general.additionalInfo}
      value={formData.additionalComments}
      onChange={handleInputChange("additionalComments")}
      placeholder={translations.form.general.additionalInfo}
    />,
  ];
  return (
    <FlexDiv width100>
      {submit === translations.form.general.emailSent ? (
        <FormSubmitMessage locale={locale} translations={translations} />
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          {flashFormData && (
            <FormTitles
              title={flashFormData?.title}
              subTitle={flashFormData?.subTitle}
            />
          )}

          <FormSteps steps={Steps} />

          <FormSubmitButton
            isValid={Object.keys(errors).length === 0}
            translations={translations}
            submitText={submit}
            loading={loading}
          />
        </form>
      )}
    </FlexDiv>
  );
};
