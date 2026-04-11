jest.mock("@/app/api/emailUtils", () => {
  const actual = jest.requireActual("@/app/api/emailUtils");

  return {
    ...actual,
    createEmailTransporter: jest.fn(() => ({
      sendMail: jest.fn().mockResolvedValue({}),
    })),
    prepareAttachments: jest.fn((uploads) => uploads),
  };
});

import { POST as contactPost } from "@/app/api/sendContactFormEmail/route";
import { POST as approxPost } from "@/app/api/sendApproxFormEmail/route";
import { POST as flashPost } from "@/app/api/sendFlashFormEmail/route";
import { POST as cartPost } from "@/app/api/sendCartFormEmail/route";
import { createEmailTransporter } from "@/app/api/emailUtils";

describe("API Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("contact route returns 400 for invalid locale", async () => {
    const request = new Request("http://localhost/api/sendContactFormEmail", {
      method: "POST",
      body: JSON.stringify({
        formData: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          company: "",
          service: "Tattoo",
          plan: "Large",
          availabilities: "Friday",
          info: "Need booking",
          width: "5",
          length: "7",
          uploads: [],
        },
        locale: "ru",
      }),
    });

    const response = await contactPost(request);
    expect(response.status).toBe(400);
  });

  test("contact route returns ok true for bot submission", async () => {
    const request = new Request("http://localhost/api/sendContactFormEmail", {
      method: "POST",
      body: JSON.stringify({
        formData: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          company: "spam",
          service: "Tattoo",
          plan: "Large",
          availabilities: "Friday",
          info: "Need booking",
          width: "5",
          length: "7",
          uploads: [],
        },
        locale: "en",
      }),
    });

    const response = await contactPost(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ ok: true });
  });

  test("contact route sends two emails for valid submission", async () => {
    const request = new Request("http://localhost/api/sendContactFormEmail", {
      method: "POST",
      body: JSON.stringify({
        formData: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          company: "",
          service: "Tattoo",
          plan: "Large",
          availabilities: "Friday",
          info: "Need booking",
          width: "5",
          length: "7",
          uploads: [],
        },
        locale: "en",
      }),
    });

    const response = await contactPost(request);
    const transporter = (createEmailTransporter as jest.Mock).mock.results[0]
      .value;

    expect(response.status).toBe(200);
    expect(transporter.sendMail).toHaveBeenCalledTimes(2);
  });

  test("approx route sends two emails for valid submission", async () => {
    const request = new Request("http://localhost/api/sendApproxFormEmail", {
      method: "POST",
      body: JSON.stringify({
        formData: {
          firstName: "Anna",
          lastName: "Smith",
          email: "anna@example.com",
          company: "",
          info: "Need estimate",
          width: "4",
          length: "6",
          uploads: [],
        },
        plan: "Medium Plan",
        locale: "en",
      }),
    });

    const response = await approxPost(request);
    const transporter = (createEmailTransporter as jest.Mock).mock.results[0]
      .value;

    expect(response.status).toBe(200);
    expect(transporter.sendMail).toHaveBeenCalledTimes(2);
  });

  test("flash route sends two emails for valid submission", async () => {
    const request = new Request("http://localhost/api/sendFlashFormEmail", {
      method: "POST",
      body: JSON.stringify({
        formData: {
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@example.com",
          company: "",
          selectedFlash: "Rose Flash",
          bodyPosition: "Forearm",
          availabilities: "Weekend",
          additionalComments: "",
        },
        currentUrl: "https://example.com/flash/rose",
        locale: "en",
      }),
    });

    const response = await flashPost(request);
    const transporter = (createEmailTransporter as jest.Mock).mock.results[0]
      .value;

    expect(response.status).toBe(200);
    expect(transporter.sendMail).toHaveBeenCalledTimes(2);
  });

  test("cart route sends two emails for valid submission", async () => {
    const request = new Request("http://localhost/api/sendCartFormEmail", {
      method: "POST",
      body: JSON.stringify({
        formData: {
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
          message: "",
        },
        cart: [
          {
            quantity: 1,
            product: {
              title: "Tattoo Balm",
              type: "Care",
              price: "15",
            },
          },
        ],
        deliveryPrice: 0,
        locale: "en",
      }),
    });

    const response = await cartPost(request);
    const transporter = (createEmailTransporter as jest.Mock).mock.results[0]
      .value;

    expect(response.status).toBe(200);
    expect(transporter.sendMail).toHaveBeenCalledTimes(2);
  });
});
