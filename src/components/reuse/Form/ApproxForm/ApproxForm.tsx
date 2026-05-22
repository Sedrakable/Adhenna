// Adhenna - src/components/reuse/Form/ApproxForm/ApproxForm.tsx
"use client";
import React, { useState, FC, ReactNode } from "react";
import styles from "../Form.module.scss";

import { Input, TextArea } from "@/components/reuse/Form/Input/Input";
import FlexDiv from "../../FlexDiv";
import { getTranslations } from "@/helpers/langUtils";
import { useLocale } from "next-intl";
import { LangType } from "@/i18n/request";
import { ApproxFormData, FormErrorData, looksLikeBot } from "../formTypes";
import {
  FormSteps,
  FormSubmitButton,
  FormTitleProps,
  MultiColumn,
} from "../Form";
import { Slider } from "../Slider/Slider";
import { UploadButton } from "../UploadButton/UploadButton";
import { encodeFiles } from "../formFiles";
import { useFormSubmission } from "../useFormSubmission";
import {
  hasFormErrors,
  validateEmailField,
  validateRequiredFields,
} from "../formValidation";

interface ApproxFormProps extends FormTitleProps {
  plan: string;
}
export const ApproxForm: FC<
  ApproxFormProps & { onSubmit: (submitted: boolean) => void }
> = ({ plan, onSubmit }) => {
  const locale = useLocale() as LangType;
  const translations = getTranslations(locale);

  const [formData, setFormData] = useState<ApproxFormData>({
    firstName: "",
    lastName: "",
    email: "",
    info: "",
    width: "4",
    length: "4",
    uploads: [],
    company: "", // Honeypot field
  });

  const [errors, setErrors] = useState<FormErrorData>({});
  const { loading, submitForm, submitText } = useFormSubmission(
    translations,
    () => onSubmit(true),
  );

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const handleInputChange = (field: keyof ApproxFormData) => (
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleWidthChange = (selected: string) => {
    setFormData((prev) => ({ ...prev, width: selected }));
    if (errors.width) {
      setErrors((prev) => ({ ...prev, width: false }));
    }
  };

  const handleLengthChange = (selected: string) => {
    setFormData((prev) => ({ ...prev, length: selected }));
    if (errors.length) {
      setErrors((prev) => ({ ...prev, length: false }));
    }
  };
  const handleFileUpload = async (files: File[]) => {
    if (files.length > 0) {
      const encodedFiles = await encodeFiles(files);
      setFormData((prev: ApproxFormData) => ({
        ...prev,
        uploads: encodedFiles,
      }));
      setUploadedFiles(files);
    } else {
      setFormData((prev: ApproxFormData) => ({ ...prev, uploads: [] }));
      setUploadedFiles([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadingFiles) return;

    if (!validateForm()) return;

    if (looksLikeBot(formData)) {
      console.error("Blocked spam-ish submission");
      return;
    }

    await submitForm({
      endpoint: "/api/sendApproxFormEmail",
      body: { formData, plan, locale },
    });
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof ApproxFormData)[] = [
      "firstName",
      "lastName",
      "email",
      "info",
      "width",
      "length",
    ];

    const newErrors = validateEmailField(
      validateRequiredFields(formData, requiredFields),
      formData.email,
    );
    setErrors(newErrors);
    return !hasFormErrors(newErrors);
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
        type="text"
        value={formData.firstName}
        onChange={handleInputChange("firstName")}
        required
        isInvalid={errors.firstName}
        placeholder={translations.form.general.firstNamePlaceholder}
      />
      <Input
        label={translations.form.general.lastName}
        type="text"
        value={formData.lastName}
        onChange={handleInputChange("lastName")}
        required
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
      label={translations.form.general.info}
      value={formData.info}
      onChange={handleInputChange("info")}
      required
      isInvalid={errors.info}
      placeholder={translations.form.general.infoPlaceholder}
    />,
    <FlexDiv gapArray={[6, 6, 6, 7]} width100 wrap>
      <Slider
        label={translations.form.contact.width}
        max={40}
        min={1}
        onChange={handleWidthChange}
        value={formData.width}
        unit={translations.form.contact.unit}
        isInvalid={errors.width}
        required
        step={1}
      />
      <Slider
        label={translations.form.contact.length}
        max={40}
        min={1}
        onChange={handleLengthChange}
        value={formData.length}
        unit={translations.form.contact.unit}
        isInvalid={errors.length}
        required
        step={1}
      />
    </FlexDiv>,
    <UploadButton
      onFilesSelect={handleFileUpload}
      accept="image/*"
      uploadedFiles={uploadedFiles}
      isInvalid={errors.upload}
      maxFiles={8}
      onProcessingChange={setUploadingFiles}
    />,
  ];

  return (
    <FlexDiv width100>
      <form onSubmit={handleSubmit} className={styles.form}>
        <FormSteps steps={Steps} />
        <FormSubmitButton
          submitText={submitText}
          isValid={!hasFormErrors(errors)}
          translations={translations}
          loading={loading || uploadingFiles}
        />
      </form>
    </FlexDiv>
  );
};
