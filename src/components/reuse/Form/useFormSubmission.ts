"use client";

import { useCallback, useState } from "react";
import { Translations } from "@/langs/langTypes";

const FORM_SUBMIT_TIMEOUT_MS = 20000;

interface SubmitOptions {
  endpoint: string;
  body: unknown;
}

interface ApiResult {
  ok?: boolean;
  error?: string;
  message?: string;
}

export const useFormSubmission = (
  translations: Translations,
  onSuccess?: () => void,
) => {
  const [submitText, setSubmitText] = useState<string | false>(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitForm = useCallback(
    async ({ endpoint, body }: SubmitOptions): Promise<boolean> => {
      const controller = new AbortController();
      const timeout = window.setTimeout(
        () => controller.abort(),
        FORM_SUBMIT_TIMEOUT_MS,
      );

      setLoading(true);
      setSubmitText(false);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        const data = (await response.json().catch(() => ({}))) as ApiResult;
        const isSuccess = response.ok && data.ok !== false;

        setSubmitText(
          isSuccess
            ? translations.form.general.emailSent
            : data.error || translations.form.general.emailNotSent,
        );
        setSubmitted(isSuccess);

        if (isSuccess) {
          onSuccess?.();
        }

        return isSuccess;
      } catch (error) {
        console.error("Form submission failed:", error);
        setSubmitText(translations.form.general.emailNotSent);
        setSubmitted(false);
        return false;
      } finally {
        window.clearTimeout(timeout);
        setLoading(false);
      }
    },
    [onSuccess, translations],
  );

  return {
    loading,
    submitted,
    submitForm,
    submitText,
  };
};
