import { FlashFormData, looksLikeBot } from "@/components/reuse/Form/formTypes";
import { LangType } from "@/i18n/request";
import { NextResponse } from "next/server";
import { createEmailTransporter } from "../emailUtils";
import { translations } from "../emailTranslations";
import { getFlashBusinessTemplate, getFlashClientTemplate } from "./templates";

export async function POST(request: Request) {
  try {
    const {
      formData,
      currentUrl,
      locale,
    }: {
      formData: FlashFormData;
      currentUrl: string;
      locale: LangType;
    } = await request.json();

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
    const t = translations.flash[locale];
    const tBusiness = translations.business.flash;

    await Promise.all([
      transporter.sendMail({
        from: `"Adhenna Tattoo" <${process.env.EMAIL_BUSINESS}>`,
        to: formData.email,
        subject: t.subject,
        html: getFlashClientTemplate(formData, currentUrl, locale),
      }),
      transporter.sendMail({
        from: `"Adhenna Tattoo" <${process.env.EMAIL_BUSINESS}>`,
        to: process.env.EMAIL_BUSINESS,
        subject: tBusiness.subject(formData.firstName, formData.lastName),
        html: getFlashBusinessTemplate(formData, currentUrl),
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
