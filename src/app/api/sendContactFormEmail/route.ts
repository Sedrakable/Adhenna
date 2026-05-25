import {
  ContactFormData,
  looksLikeBot,
} from "@/components/reuse/Form/formTypes";
import { LangType } from "@/i18n/request";
import { NextResponse } from "next/server";
import { createEmailTransporter, prepareAttachments } from "../emailUtils";
import { translations } from "../emailTranslations";
import {
  getContactBusinessTemplate,
  getContactClientTemplate,
} from "./templates";

export async function POST(request: Request) {
  try {
    const {
      formData,
      locale,
    }: {
      formData: ContactFormData;
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

    const attachments = prepareAttachments(formData.uploads);
    const transporter = createEmailTransporter();
    const t = translations.contact[locale];
    const tBusiness = translations.business.contact;

    await Promise.all([
      transporter.sendMail({
        from: `"Adhenna Tattoo" <${process.env.EMAIL_BUSINESS}>`,
        to: formData.email,
        subject: t.subject,
        html: getContactClientTemplate(formData, locale),
        attachments,
      }),
      transporter.sendMail({
        from: `"Adhenna Tattoo" <${process.env.EMAIL_BUSINESS}>`,
        to: process.env.EMAIL_BUSINESS,
        subject: tBusiness.subject(
          formData.firstName,
          formData.lastName,
          locale,
        ),
        html: getContactBusinessTemplate(formData, locale),
        attachments,
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
