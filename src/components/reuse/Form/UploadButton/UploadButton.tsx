import React, { useEffect, useRef, useState } from "react";
import styles from "./UploadButton.module.scss";
import { Paragraph } from "../../Paragraph/Paragraph";
import { useLocale } from "next-intl";
import { getTranslations } from "@/helpers/langUtils";
import { LangType } from "@/i18n/request";
import { Icon } from "../../Icon";
import FlexDiv from "../../FlexDiv";
import { IconButton } from "../../IconButton";

interface UploadButtonProps {
  onFilesSelect: (files: File[]) => void | Promise<void>;
  accept?: string;
  uploadedFiles?: File[];
  maxFiles?: number;
  isInvalid?: boolean;
  required?: boolean;
  onProcessingChange?: (processing: boolean) => void;
}

const MAX_IMAGE_WIDTH = 1800;
const MAX_IMAGE_HEIGHT = 1800;
const IMAGE_QUALITY = 0.78;

const resizeImage = (file: File): Promise<File> => {
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return Promise.resolve(file);
  }

  return new Promise((resolve) => {
    const image = new window.Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);

      const scale = Math.min(
        1,
        MAX_IMAGE_WIDTH / image.width,
        MAX_IMAGE_HEIGHT / image.height,
      );

      if (scale >= 1) {
        resolve(file);
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);

      const context = canvas.getContext("2d");
      if (!context) {
        resolve(file);
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          resolve(
            new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
              type: "image/jpeg",
              lastModified: Date.now(),
            }),
          );
        },
        "image/jpeg",
        IMAGE_QUALITY,
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    image.src = url;
  });
};

export const UploadButton: React.FC<UploadButtonProps> = ({
  onFilesSelect,
  accept = "image/*",
  uploadedFiles = [],
  maxFiles = 8,
  isInvalid = false,
  required = true,
  onProcessingChange,
}) => {
  const locale = useLocale() as LangType;
  const translations = getTranslations(locale);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlsRef = useRef<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | false>(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const canAddMore = uploadedFiles.length < maxFiles && !isProcessing;
  const fileLimitText =
    locale === "fr" ? `Jusqu'a ${maxFiles} images` : `Up to ${maxFiles} images`;
  const uploadText = isProcessing
    ? locale === "fr"
      ? "Preparation des images..."
      : "Preparing images..."
    : translations.form.general.upload;

  useEffect(() => {
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));

    const urls = uploadedFiles.map((file) => URL.createObjectURL(file));
    previewUrlsRef.current = urls;
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      previewUrlsRef.current = [];
    };
  }, [uploadedFiles]);

  const handleClick = () => {
    if (fileInputRef.current && !isProcessing) {
      fileInputRef.current.click();
    }
  };

  const addFiles = async (files: File[]) => {
    if (isProcessing) return;

    setError(false);

    if (uploadedFiles.length + files.length > maxFiles) {
      setError(fileLimitText);
      return;
    }

    setIsProcessing(true);
    onProcessingChange?.(true);
    try {
      const resizedFiles = await Promise.all(files.map(resizeImage));
      await onFilesSelect([...uploadedFiles, ...resizedFiles]);
    } finally {
      setIsProcessing(false);
      onProcessingChange?.(false);
    }
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      await addFiles(Array.from(event.target.files));
      event.target.value = "";
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      await addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeFile = (index: number) => {
    setError(false);
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    onFilesSelect(newFiles);
  };

  return (
    <FlexDiv
      width100
      gapArray={[4, 5, 5, 5]}
      flex={{ x: "flex-start", y: "stretch" }}
      className={`${styles.container} ${dragActive ? styles.dragActive : ""}`}
    >
      {uploadedFiles.length === 0 && (
        <FlexDiv
          className={`${styles.uploadButton} ${
            dragActive ? styles.dragActive : ""
          } ${uploadedFiles.length > 0 ? styles.uploaded : ""} ${
            isInvalid ? styles.invalid : ""
          }`}
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          width100
          flex={{ direction: "column" }}
          gapArray={[3, 4, 4, 4]}
          padding={{ horizontal: [7], vertical: [5] }}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleChange}
            accept={accept}
            multiple
            style={{ display: "none" }}
          />

          <Icon
            icon={"upload"}
            size="large"
            color="burgundy"
            className={styles.icon}
          />

          <Paragraph
            level="big"
            color="burgundy"
            weight={500}
            textAlign="center"
          >
            {uploadText}
          </Paragraph>
          <Paragraph level="regular" color="burgundy" textAlign="center">
            {fileLimitText}
          </Paragraph>
          {required && (
            <Paragraph
              level="big"
              color="burgundy"
              weight={500}
              className={styles.required}
            >
              *
            </Paragraph>
          )}
        </FlexDiv>
      )}
      {uploadedFiles.length > 0 && (
        <FlexDiv wrap gapArray={[4]} flex={{ x: "flex-start" }} width100>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleChange}
            accept={accept}
            multiple
            style={{ display: "none" }}
          />
          {uploadedFiles.map((_, index) => (
            <FlexDiv
              key={index}
              flex={{ direction: "column" }}
              className={styles.imageWrapper}
              style={{ position: "relative" }}
            >
              <IconButton
                aria-label={`Remove ${uploadedFiles[index]?.name || "file"}`}
                background="white"
                className={styles.removeButton}
                iconProps={{ icon: "close", size: "small" }}
                onClick={() => removeFile(index)}
                type="button"
              />
              {previewUrls[index] && (
                <img
                  src={previewUrls[index]}
                  alt={`preview-${index}`}
                  className={styles.previewImage}
                />
              )}
            </FlexDiv>
          ))}
          {canAddMore && (
            <FlexDiv
              className={styles.addMore}
              flex={{ direction: "column", x: "center" }}
              gapArray={[2]}
              onClick={handleClick}
              padding={{ all: [4] }}
            >
              <IconButton
                aria-label="Upload more files"
                background="white"
                iconProps={{ icon: "plus", size: "regular" }}
                type="button"
              />
              <Paragraph level="regular" color="burgundy" textAlign="center">
                {locale === "fr" ? "Ajouter" : "Add more"}
              </Paragraph>
              <Paragraph level="regular" color="burgundy" textAlign="center">
                {uploadedFiles.length}/{maxFiles}
              </Paragraph>
            </FlexDiv>
          )}
        </FlexDiv>
      )}
      {error && (
        <Paragraph level="regular" color="error">
          {error}
        </Paragraph>
      )}
    </FlexDiv>
  );
};
