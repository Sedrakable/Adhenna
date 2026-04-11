// Adhenna - formValidation.test.ts
import type {
  ContactFormData,
  ApproxFormData,
  FlashFormData,
  AddressFormData,
  FormErrorData,
} from "@/components/reuse/Form/formTypes";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateContactForm = (
  formData: ContactFormData,
): { isValid: boolean; errors: FormErrorData } => {
  const errors: FormErrorData = {};
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

  requiredFields.forEach((key) => {
    if (!formData[key]) {
      errors[key] = true;
    }
  });

  if (formData.email && !emailRegex.test(formData.email)) {
    errors.email = true;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateApproxForm = (
  formData: ApproxFormData,
): { isValid: boolean; errors: FormErrorData } => {
  const errors: FormErrorData = {};
  const requiredFields: (keyof ApproxFormData)[] = [
    "firstName",
    "lastName",
    "email",
    "info",
    "width",
    "length",
  ];

  requiredFields.forEach((key) => {
    if (!formData[key]) {
      errors[key] = true;
    }
  });

  if (formData.email && !emailRegex.test(formData.email)) {
    errors.email = true;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateFlashForm = (
  formData: FlashFormData,
): { isValid: boolean; errors: FormErrorData } => {
  const errors: FormErrorData = {};
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
      errors[field] = true;
    }
  });

  if (formData.email && !emailRegex.test(formData.email)) {
    errors.email = true;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateCartForm = (
  formData: AddressFormData,
): { isValid: boolean; errors: FormErrorData } => {
  const errors: FormErrorData = {};

  Object.keys(formData).forEach((key) => {
    if (
      !formData[key as keyof AddressFormData] &&
      key !== "addressLine2" &&
      key !== "message" &&
      key !== "company"
    ) {
      errors[key] = true;
    }
  });

  if (formData.email && !emailRegex.test(formData.email)) {
    errors.email = true;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

describe("Adhenna Form Validation", () => {
  describe("ContactForm", () => {
    test("passes with all required fields", () => {
      const formData: ContactFormData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        company: "",
        service: "Tattoo",
        plan: "Large Piece",
        availabilities: "Weekdays",
        info: "Custom dragon design",
        width: "5",
        length: "7",
        uploads: [],
      };

      const result = validateContactForm(formData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test("fails missing service", () => {
      const formData: ContactFormData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        company: "",
        service: "",
        plan: "Large Piece",
        availabilities: "Weekdays",
        info: "Custom dragon design",
        width: "5",
        length: "7",
        uploads: [],
      };

      const result = validateContactForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.service).toBe(true);
    });

    test("fails invalid email", () => {
      const formData: ContactFormData = {
        firstName: "John",
        lastName: "Doe",
        email: "johnexample.com",
        company: "",
        service: "Tattoo",
        plan: "Large Piece",
        availabilities: "Weekdays",
        info: "Custom dragon design",
        width: "5",
        length: "7",
        uploads: [],
      };

      const result = validateContactForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe(true);
    });
  });

  describe("ApproxForm", () => {
    test("passes with all required fields", () => {
      const formData: ApproxFormData = {
        firstName: "Anna",
        lastName: "Smith",
        email: "anna@example.com",
        company: "",
        info: "Need a rough estimate for a forearm tattoo.",
        width: "4",
        length: "6",
        uploads: [],
      };

      const result = validateApproxForm(formData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test("fails missing info", () => {
      const formData: ApproxFormData = {
        firstName: "Anna",
        lastName: "Smith",
        email: "anna@example.com",
        company: "",
        info: "",
        width: "4",
        length: "6",
        uploads: [],
      };

      const result = validateApproxForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.info).toBe(true);
    });

    test("fails invalid email", () => {
      const formData: ApproxFormData = {
        firstName: "Anna",
        lastName: "Smith",
        email: "annaexample.com",
        company: "",
        info: "Need estimate",
        width: "4",
        length: "6",
        uploads: [],
      };

      const result = validateApproxForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe(true);
    });
  });

  describe("FlashForm", () => {
    test("passes with required fields", () => {
      const formData: FlashFormData = {
        firstName: "Jane",
        lastName: "Miller",
        email: "jane@example.com",
        company: "",
        selectedFlash: "Rose Flash",
        bodyPosition: "Forearm",
        availabilities: "Saturday",
        additionalComments: "",
      };

      const result = validateFlashForm(formData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test("fails missing selectedFlash", () => {
      const formData: FlashFormData = {
        firstName: "Jane",
        lastName: "Miller",
        email: "jane@example.com",
        company: "",
        selectedFlash: "",
        bodyPosition: "Forearm",
        availabilities: "Saturday",
        additionalComments: "",
      };

      const result = validateFlashForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.selectedFlash).toBe(true);
    });

    test("fails invalid email", () => {
      const formData: FlashFormData = {
        firstName: "Jane",
        lastName: "Miller",
        email: "janeexample.com",
        company: "",
        selectedFlash: "Rose Flash",
        bodyPosition: "Forearm",
        availabilities: "Saturday",
        additionalComments: "",
      };

      const result = validateFlashForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe(true);
    });
  });

  describe("CartForm", () => {
    test("passes with required fields", () => {
      const formData: AddressFormData = {
        firstName: "Marc",
        lastName: "Roy",
        email: "marc@example.com",
        company: "",
        addressLine1: "123 Main Street",
        addressLine2: "",
        postalCode: "H2X 1Y4",
        country: "CA",
        state: "QC",
        city: "Montréal",
        delivery: "Delivery",
        message: "",
      };

      const result = validateCartForm(formData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test("fails missing addressLine1", () => {
      const formData: AddressFormData = {
        firstName: "Marc",
        lastName: "Roy",
        email: "marc@example.com",
        company: "",
        addressLine1: "",
        addressLine2: "",
        postalCode: "H2X 1Y4",
        country: "CA",
        state: "QC",
        city: "Montréal",
        delivery: "Delivery",
        message: "",
      };

      const result = validateCartForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.addressLine1).toBe(true);
    });

    test("does not fail for optional addressLine2 and message", () => {
      const formData: AddressFormData = {
        firstName: "Marc",
        lastName: "Roy",
        email: "marc@example.com",
        company: "",
        addressLine1: "123 Main Street",
        addressLine2: "",
        postalCode: "H2X 1Y4",
        country: "CA",
        state: "QC",
        city: "Montréal",
        delivery: "Pickup",
        message: "",
      };

      const result = validateCartForm(formData);
      expect(result.isValid).toBe(true);
    });

    test("fails invalid email", () => {
      const formData: AddressFormData = {
        firstName: "Marc",
        lastName: "Roy",
        email: "marcexample.com",
        company: "",
        addressLine1: "123 Main Street",
        addressLine2: "",
        postalCode: "H2X 1Y4",
        country: "CA",
        state: "QC",
        city: "Montréal",
        delivery: "Pickup",
        message: "",
      };

      const result = validateCartForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe(true);
    });
  });
});
