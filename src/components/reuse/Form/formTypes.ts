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

export type BotDetectionReason =
  | "honeypot_filled"
  | "invalid_email"
  | "missing_first_name"
  | "missing_last_name"
  | "first_name_too_long"
  | "last_name_too_long";

export const getBotDetectionReason = (
  formData: BaseFormData,
): BotDetectionReason | false => {
  const honeypotFilled =
    typeof formData.company === "string" && formData.company.trim().length > 0;

  if (honeypotFilled) return "honeypot_filled";

  const email = formData.email?.trim() ?? "";
  const firstName = formData.firstName?.trim() ?? "";
  const lastName = formData.lastName?.trim() ?? "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "invalid_email";
  if (firstName.length === 0) return "missing_first_name";
  if (lastName.length === 0) return "missing_last_name";
  if (firstName.length > 80) return "first_name_too_long";
  if (lastName.length > 80) return "last_name_too_long";

  return false;
};

export const looksLikeBot = (formData: BaseFormData): boolean =>
  Boolean(getBotDetectionReason(formData));
