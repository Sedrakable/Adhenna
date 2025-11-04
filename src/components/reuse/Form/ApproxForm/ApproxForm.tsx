"use client";
import React, { useState, FC, ReactNode } from "react";
import styles from "../Form.module.scss";

import { Input, TextArea } from "@/components/reuse/Form/Input/Input";
import FlexDiv from "../../FlexDiv";
import { getTranslations } from "@/helpers/langUtils";
import { useLocale } from "next-intl";
import { LangType } from "@/i18n/request";
import { ApproxFormData, EncodedFileType, FormErrorData } from "../formTypes";
import {
  FormSteps,
  FormSubmitButton,
  FormTitleProps,
  MultiColumn,
} from "../Form";
import { Slider } from "../Slider/Slider";
import { UploadButton } from "../UploadButton/UploadButton";

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
  });

  const [errors, setErrors] = useState<FormErrorData>({});
  const [submit, setSubmit] = useState<string | false>(false);
  const [loading, setLoading] = useState(false); // New loading state

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleInputChange = (field: keyof ApproxFormData) => (
    value: string
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
  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const filePromises: Promise<EncodedFileType>[] = files.map((file) => {
        return new Promise<{ name: string; type: string; data: string }>(
          (resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              const fileData = (event.target?.result as string)?.split(",")[1];
              resolve({
                name: file.name,
                type: file.type,
                data: fileData,
              });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          }
        );
      });

      Promise.all(filePromises).then((encodedFiles) => {
        setFormData((prev: ApproxFormData) => ({
          ...prev,
          uploads: encodedFiles,
        }));
        setUploadedFiles(files);
        console.log("Uploaded files:", encodedFiles);
      });
    } else {
      setFormData((prev: ApproxFormData) => ({ ...prev, uploads: [] }));
      setUploadedFiles([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/sendApproxFormEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData, plan, locale }),
      });

      if (response.ok) {
        setSubmit(translations.form.general.emailSent);
        onSubmit(true);

        // Add success handling (e.g., show success message, reset form)
      } else {
        console.error("Failed to send flash request", response);
        setSubmit(translations.form.general.emailNotSent);
        // Add error handling (e.g., show error message)
      }
    } catch (error) {
      console.error("Error:", error);
      setSubmit(translations.form.general.emailNotSent);
    } finally {
      setLoading(false); // Set loading to false after submission
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrorData = {};
    (Object.keys(formData) as Array<keyof ApproxFormData>).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = true;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const Steps: ReactNode[] = [
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
        isInvalid={errors.lenght}
        required
        step={1}
      />
    </FlexDiv>,
    <UploadButton
      onFilesSelect={handleFileUpload}
      accept="image/*"
      uploadedFiles={uploadedFiles}
      isInvalid={errors.upload}
      maxFiles={3}
    />,
  ];

  return (
    <FlexDiv width100>
      <form onSubmit={handleSubmit} className={styles.form}>
        <FormSteps steps={Steps} />
        <FormSubmitButton
          submitText={submit}
          isValid={Object.keys(errors).length === 0}
          translations={translations}
          loading={loading}
        />
      </form>
    </FlexDiv>
  );
};
