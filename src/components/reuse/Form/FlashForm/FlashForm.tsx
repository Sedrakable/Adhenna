// Adhenna - src/components/reuse/Form/FlashForm/FlashForm.tsx
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
import { FlashFormData, FormErrorData, looksLikeBot } from "../formTypes";
import FlexDiv from "../../FlexDiv";
import { useFormSubmission } from "../useFormSubmission";
import {
  hasFormErrors,
  validateEmailField,
  validateRequiredFields,
} from "../formValidation";

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
    company: "", // Honeypot field
  });

  const [errors, setErrors] = useState<FormErrorData>({});
  const { loading, submitted, submitForm, submitText } =
    useFormSubmission(translations);

  const handleInputChange = (field: keyof FlashFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
    }
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof FlashFormData)[] = [
      "firstName",
      "lastName",
      "email",
      "selectedFlash",
      "bodyPosition",
      "availabilities",
    ];

    const newErrors = validateEmailField(
      validateRequiredFields(formData, requiredFields),
      formData.email,
    );
    setErrors(newErrors);
    return !hasFormErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (looksLikeBot(formData)) {
      console.error("Blocked spam-ish submission");
      return;
    }

    await submitForm({
      endpoint: "/api/sendFlashFormEmail",
      body: { formData, currentUrl, locale },
    });
  };

  const Steps: ReactNode[] = [
    <Input
      label="Company"
      type="text"
      value={formData.company || ""}
      onChange={handleInputChange("company")}
      placeholder=""
      honeyPot
    />,
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
      {submitted ? (
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
            isValid={!hasFormErrors(errors)}
            translations={translations}
            submitText={submitText}
            loading={loading}
          />
        </form>
      )}
    </FlexDiv>
  );
};
