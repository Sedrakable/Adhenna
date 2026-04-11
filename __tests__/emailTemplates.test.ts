import { getContactClientTemplate } from "@/app/api/sendContactFormEmail/templates";
import { getApproxClientTemplate } from "@/app/api/sendApproxFormEmail/templates";
import { getFlashClientTemplate } from "@/app/api/sendFlashFormEmail/templates";
import { getCartClientTemplate } from "@/app/api/sendCartFormEmail/templates";
import type {
  ContactFormData,
  ApproxFormData,
  FlashFormData,
  AddressFormData,
} from "@/components/reuse/Form/formTypes";
import type { ICartProduct } from "@/data.d";

describe("Email Templates", () => {
  test("contact template escapes dangerous user input", () => {
    const formData: ContactFormData = {
      firstName: `<script>alert("x")</script>`,
      lastName: "Doe",
      email: "john@example.com",
      company: "",
      service: "Tattoo",
      plan: "Large",
      availabilities: "Friday",
      info: `<b>Injected</b> info`,
      width: "5",
      length: "7",
      uploads: [],
    };

    const html = getContactClientTemplate(formData, "en");

    expect(html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
    expect(html).toContain("&lt;b&gt;Injected&lt;/b&gt; info");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<b>Injected</b>");
  });

  test("approx template contains safe dimensions and info", () => {
    const formData: ApproxFormData = {
      firstName: "Anna",
      lastName: "Smith",
      email: "anna@example.com",
      company: "",
      info: "Estimate for shoulder piece",
      width: "4",
      length: "6",
      uploads: [],
    };

    const html = getApproxClientTemplate(formData, "Medium Plan", "en");

    expect(html).toContain('4" x 6"');
    expect(html).toContain("Estimate for shoulder piece");
  });

  test("flash template escapes dangerous comments", () => {
    const formData: FlashFormData = {
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      company: "",
      selectedFlash: "Rose",
      bodyPosition: "Forearm",
      availabilities: "Weekend",
      additionalComments: `<img src=x onerror=alert(1)>`,
    };

    const html = getFlashClientTemplate(
      formData,
      "https://example.com/flash/rose",
      "en",
    );

    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(html).not.toContain("<img");
  });

  test("cart template includes product and shipping info safely", () => {
    const formData: AddressFormData = {
      firstName: "Marc",
      lastName: "Roy",
      email: "marc@example.com",
      company: "",
      addressLine1: "123 Main St",
      addressLine2: "",
      postalCode: "H2X 1Y4",
      country: "CA",
      state: "QC",
      city: "Montréal",
      delivery: "Pickup",
      message: `<b>Leave outside</b>`,
    };

    const cart: ICartProduct[] = [
      {
        quantity: 2,
        product: {
          title: "Tattoo Balm",
          type: "Care",
          price: "15",
        },
      } as ICartProduct,
    ];

    const html = getCartClientTemplate(formData, cart, 0, "en");

    expect(html).toContain("Tattoo Balm");
    expect(html).toContain("123 Main St");
    expect(html).toContain("&lt;b&gt;Leave outside&lt;/b&gt;");
    expect(html).not.toContain("<b>Leave outside</b>");
  });
});
