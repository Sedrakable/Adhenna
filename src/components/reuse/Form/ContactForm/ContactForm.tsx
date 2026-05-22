// Adhenna - src/components/reuse/Form/ContactForm/ContactForm.tsx
"use client";
import React, { useState, useEffect, FC, ReactNode } from "react";
import styles from "../Form.module.scss";
import { Input, TextArea } from "@/components/reuse/Form/Input/Input";
import { OptionType, Select } from "../Select";
import FlexDiv from "../../FlexDiv";
import { getTranslations } from "@/helpers/langUtils";
import { useLocale } from "next-intl";
import { LangType } from "@/i18n/request";
import { ContactFormData, FormErrorData, looksLikeBot } from "../formTypes";
import {
  FormTitleProps,
  MultiColumn,
  FormSubmitButton,
  FormSteps,
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

export interface ServicesAndPlans {
  service: OptionType;
  plans: OptionType[];
}
export interface ContactFormProps extends FormTitleProps {
  servicesAndPlans: ServicesAndPlans[];
}
export const ContactForm: FC<
  ContactFormProps & { onSubmit: (submitted: boolean) => void }
> = ({ servicesAndPlans, onSubmit }) => {
  const locale = useLocale() as LangType;
  const translations = getTranslations(locale);

  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    service: "",
    plan: "",
    availabilities: "",
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

  const [services, setServices] = useState<OptionType[]>([]);
  const [plans, setPlans] = useState<OptionType[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  useEffect(() => {
    if (servicesAndPlans.length > 0) {
      const serviceOptions = servicesAndPlans.map((item) => item.service);
      setServices(serviceOptions);

      const initialService = serviceOptions[0].value;

      setFormData((prev) => ({ ...prev, service: initialService }));

      const initialPlans = servicesAndPlans[0].plans;
      setPlans(initialPlans);
    }
  }, [servicesAndPlans]);

  const handleInputChange = (field: keyof ContactFormData) => (
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleServiceChange = (selected: string) => {
    const selectedService = servicesAndPlans.find(
      (item) => item.service.value === selected,
    );
    if (selectedService) {
      setPlans(selectedService.plans);
      setFormData((prev) => ({ ...prev, service: selected, plan: "" }));
    }
    if (errors.service) {
      setErrors((prev) => ({ ...prev, service: false }));
    }
  };

  const handlePlanChange = (selected: string) => {
    setFormData((prev) => ({ ...prev, plan: selected }));
    if (errors.plan) {
      setErrors((prev) => ({ ...prev, plan: false }));
    }
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
      setFormData((prev: ContactFormData) => ({
        ...prev,
        uploads: encodedFiles,
      }));
      setUploadedFiles(files);
    } else {
      setFormData((prev: ContactFormData) => ({ ...prev, uploads: [] }));
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
      endpoint: "/api/sendContactFormEmail",
      body: { formData, locale },
    });
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof ContactFormData)[] = [
      "firstName",
      "lastName",
      "email",
      "service",
      "plan",
      "availabilities",
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
    <MultiColumn>
      <Select
        label={translations.form.contact.service}
        options={services}
        onChange={handleServiceChange}
        defaultValue={formData.service}
        isInvalid={errors.service}
        required
      />
      <Select
        label={translations.form.contact.plan}
        options={plans}
        onChange={handlePlanChange}
        defaultValue={formData.plan}
        placeholder={translations.form.contact.plan}
        isInvalid={errors.plan}
        required
      />
    </MultiColumn>,
    <TextArea
      label={translations.form.general.availabilities}
      value={formData.availabilities}
      onChange={handleInputChange("availabilities")}
      required
      isInvalid={errors.availabilities}
      placeholder={translations.form.general.availabilitiesPlaceholder}
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
          isValid={!hasFormErrors(errors)}
          translations={translations}
          submitText={submitText}
          loading={loading || uploadingFiles}
        />
      </form>
    </FlexDiv>
  );
};
