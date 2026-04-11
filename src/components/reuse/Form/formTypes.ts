// Adhenna - src/components/reuse/Form/formTypes.ts
export interface BaseFormData {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
}

export interface AddressFormData extends BaseFormData {
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  country: string;
  state: string;
  city: string;
  delivery: string;
  message: string;
}

export interface FlashFormData extends BaseFormData {
  selectedFlash: string;
  bodyPosition: string;
  availabilities: string;
  additionalComments: string;
}

export interface EncodedFileType {
  name: string;
  type: string;
  data: string;
}
export interface ContactFormData extends BaseFormData {
  service: string;
  plan: string;
  availabilities: string;
  info: string;
  width: string;
  length: string;
  uploads: EncodedFileType[];
}

export interface ApproxFormData extends BaseFormData {
  info: string;
  width: string;
  length: string;
  uploads: EncodedFileType[];
}

export interface FormErrorData {
  [key: string]: boolean;
}

export interface StepProps {
  number: number | undefined;
}

export const looksLikeBot = (formData: BaseFormData): boolean => {
  const honeypotFilled =
    typeof formData.company === "string" && formData.company.trim().length > 0;

  if (honeypotFilled) return true;

  const email = formData.email?.trim() ?? "";
  const firstName = formData.firstName?.trim() ?? "";
  const lastName = formData.lastName?.trim() ?? "";

  const invalidEmail = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const suspiciousName =
    firstName.length === 0 ||
    lastName.length === 0 ||
    firstName.length > 80 ||
    lastName.length > 80;

  return invalidEmail || suspiciousName;
};
