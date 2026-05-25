import { FormErrorData } from "./formTypes";

export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validateRequiredFields = <T extends object>(
  formData: T,
  requiredFields: (keyof T)[],
): FormErrorData => {
  return requiredFields.reduce<FormErrorData>((errors, key) => {
    const value = formData[key];

    if (!value) {
      errors[String(key)] = true;
    }

    return errors;
  }, {});
};

export const validateEmailField = (
  errors: FormErrorData,
  email: string,
): FormErrorData => {
  if (email && !isValidEmail(email)) {
    return { ...errors, email: true };
  }

  return errors;
};

export const hasFormErrors = (errors: FormErrorData): boolean =>
  Object.values(errors).some(Boolean);
