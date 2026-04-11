import { looksLikeBot } from "@/components/reuse/Form/formTypes";
import type {
  ContactFormData,
  ApproxFormData,
  FlashFormData,
  AddressFormData,
} from "@/components/reuse/Form/formTypes";

describe("Adhenna Bot Detection", () => {
  describe("Should BLOCK", () => {
    test("honeypot filled on contact form", () => {
      const formData: ContactFormData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        company: "Spam Company",
        service: "Tattoo",
        plan: "Medium Piece",
        availabilities: "Mondays and Fridays",
        info: "I want a floral tattoo design.",
        width: "4",
        length: "5",
        uploads: [],
      };

      expect(looksLikeBot(formData)).toBe(true);
    });

    test("empty first name", () => {
      const formData: ApproxFormData = {
        firstName: "",
        lastName: "Doe",
        email: "john@example.com",
        info: "I want a rough estimate.",
        width: "4",
        length: "4",
        uploads: [],
      };

      expect(looksLikeBot(formData)).toBe(true);
    });

    test("empty last name", () => {
      const formData: FlashFormData = {
        firstName: "Jane",
        lastName: "",
        email: "jane@example.com",
        selectedFlash: "Rose Flash",
        bodyPosition: "Forearm",
        availabilities: "Weekends",
        additionalComments: "No colour please.",
      };

      expect(looksLikeBot(formData)).toBe(true);
    });

    test("invalid email format", () => {
      const formData: AddressFormData = {
        firstName: "Mike",
        lastName: "Smith",
        email: "mikeexample.com",
        addressLine1: "123 Main St",
        addressLine2: "",
        postalCode: "H2X 1Y4",
        country: "CA",
        state: "QC",
        city: "Montréal",
        delivery: "Pickup",
        message: "Please let me know when ready.",
      };

      expect(looksLikeBot(formData)).toBe(true);
    });

    test("first name too long", () => {
      const formData: ContactFormData = {
        firstName: "A".repeat(81),
        lastName: "Doe",
        email: "john@example.com",
        service: "Tattoo",
        plan: "Medium Piece",
        availabilities: "Mondays",
        info: "Interested in booking.",
        width: "4",
        length: "5",
        uploads: [],
      };

      expect(looksLikeBot(formData)).toBe(true);
    });

    test("last name too long", () => {
      const formData: ContactFormData = {
        firstName: "John",
        lastName: "B".repeat(81),
        email: "john@example.com",
        service: "Tattoo",
        plan: "Medium Piece",
        availabilities: "Mondays",
        info: "Interested in booking.",
        width: "4",
        length: "5",
        uploads: [],
      };

      expect(looksLikeBot(formData)).toBe(true);
    });
  });

  describe("Should ALLOW", () => {
    test("normal contact form submission", () => {
      const formData: ContactFormData = {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah@example.com",
        company: "",
        service: "Tattoo",
        plan: "Large Piece",
        availabilities: "Tuesday afternoons",
        info: "I want a custom floral design on my upper arm.",
        width: "6",
        length: "8",
        uploads: [],
      };

      expect(looksLikeBot(formData)).toBe(false);
    });

    test("normal approx form submission", () => {
      const formData: ApproxFormData = {
        firstName: "Alex",
        lastName: "Martin",
        email: "alex@example.com",
        company: "",
        info: "Looking for a rough quote for a shoulder piece.",
        width: "5",
        length: "7",
        uploads: [],
      };

      expect(looksLikeBot(formData)).toBe(false);
    });

    test("normal flash form submission", () => {
      const formData: FlashFormData = {
        firstName: "Emma",
        lastName: "Brown",
        email: "emma@example.com",
        company: "",
        selectedFlash: "Butterfly Flash",
        bodyPosition: "Ankle",
        availabilities: "Thursday morning",
        additionalComments: "Fine line preferred.",
      };

      expect(looksLikeBot(formData)).toBe(false);
    });

    test("normal cart form submission", () => {
      const formData: AddressFormData = {
        firstName: "Lucas",
        lastName: "Roy",
        email: "lucas@example.com",
        company: "",
        addressLine1: "456 Rue Sainte-Catherine",
        addressLine2: "Apt 3",
        postalCode: "H3B 1A7",
        country: "CA",
        state: "QC",
        city: "Montréal",
        delivery: "Delivery",
        message: "Leave at the door.",
      };

      expect(looksLikeBot(formData)).toBe(false);
    });

    test("name length exactly 80 should pass", () => {
      const formData: ApproxFormData = {
        firstName: "A".repeat(80),
        lastName: "B".repeat(80),
        email: "valid@example.com",
        company: "",
        info: "Estimate request",
        width: "4",
        length: "4",
        uploads: [],
      };

      expect(looksLikeBot(formData)).toBe(false);
    });
  });
});
