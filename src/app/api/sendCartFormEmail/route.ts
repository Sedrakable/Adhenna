import {
  AddressFormData,
  looksLikeBot,
} from "@/components/reuse/Form/formTypes";
import { ICartProduct } from "@/data.d";
import { LangType } from "@/i18n/request";
import { NextResponse } from "next/server";
import { createEmailTransporter } from "../emailUtils";
import { translations } from "../emailTranslations";
import { getCartBusinessTemplate, getCartClientTemplate } from "./templates";

interface RequestData {
  formData: AddressFormData;
  cart: ICartProduct[];
  deliveryPrice: number;
  locale: LangType;
}

export async function POST(request: Request) {
  try {
    const {
      formData,
      cart,
      deliveryPrice = 0,
      locale = "fr",
    }: RequestData = await request.json();

    if (!["en", "fr"].includes(locale)) {
      return NextResponse.json(
        { ok: false, error: "Invalid locale. Must be 'en' or 'fr'" },
        { status: 400 },
      );
    }

    if (looksLikeBot(formData)) {
      return NextResponse.json({ ok: true });
    }

    const transporter = createEmailTransporter();
    const t = translations.cart[locale];
    const tBusiness = translations.business.cart;

    await Promise.all([
      transporter.sendMail({
        from: `"Adhenna Tattoo" <${process.env.EMAIL_BUSINESS}>`,
        to: formData.email,
        subject: t.subject,
        html: getCartClientTemplate(formData, cart, deliveryPrice, locale),
      }),
      transporter.sendMail({
        from: `"Adhenna Tattoo" <${process.env.EMAIL_BUSINESS}>`,
        to: process.env.EMAIL_BUSINESS,
        subject: tBusiness.subject(
          formData.firstName,
          formData.lastName,
          locale,
        ),
        html: getCartBusinessTemplate(formData, cart, deliveryPrice, locale),
      }),
    ]);

    return NextResponse.json({ ok: true, message: "Emails sent successfully" });
  } catch (error) {
    console.error("Server error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Failed to send emails",
        details: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
