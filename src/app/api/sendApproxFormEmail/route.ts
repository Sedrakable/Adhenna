import { ApproxFormData } from "@/components/reuse/Form/formTypes";
import { LangType } from "@/i18n/request";
import { NextResponse } from "next/server";
import {
  createEmailTransporter,
  prepareAttachments,
  createEmailTemplate,
} from "../emailUtils";
import { translations } from "../emailTranslations";

/**
 * Generate client email content for approx form
 */
const generateClientEmailContent = (
  formData: ApproxFormData,
  plan: string,
  locale: LangType
): string => {
  const t = translations.approx[locale];

  return `
    <h1>${t.title(plan)}</h1>
    
    <div class="details-section">
      <p>${t.greeting(formData.firstName)}</p>
      <p>${t.thankYouMessage(plan)}</p>
    </div>
    
    <div class="details-section">
      <div class="detail-item">
        <span class="detail-label">${t.dimensions}</span>
        <p>${formData.width}" x ${formData.length}"</p>
      </div>
      
      ${
        formData.info
          ? `
      <div class="detail-item">
        <span class="detail-label">${t.additionalInfo}</span>
        <p>${formData.info}</p>
      </div>
      `
          : ""
      }
    </div>
    
    <div class="signature">
      ${t.regards}<br>${t.team}
    </div>
  `;
};

/**
 * Generate business email content for approx form
 */
const generateBusinessEmailContent = (
  formData: ApproxFormData,
  plan: string,
  locale: LangType
): string => {
  const t = translations.business.approx;

  return `
    <h1>${t.title}</h1>
    
    <div class="details-section">
      <h2>${t.customerInfo}</h2>
      <p>
        <strong>${t.name}</strong> ${formData.firstName} ${
    formData.lastName
  }<br>
        <strong>${t.email}</strong> ${formData.email}<br>
        <strong>${t.language}</strong> ${locale.toUpperCase()}<br>
      </p>
    </div>

    <div class="details-section">
      <h2>${t.serviceDetails}</h2>
      <p>
        <strong>${t.service}</strong> ${plan}<br>
        <strong>${t.dimensions}</strong> ${formData.width}" x ${
    formData.length
  }"<br>
      </p>
      
      ${
        formData.info
          ? `
      <h2>${t.additionalInfo}</h2>
      <p>${formData.info}</p>
      `
          : ""
      }
    </div>
  `;
};

/**
 * POST handler for approx form email
 */
export async function POST(request: Request) {
  try {
    const {
      formData,
      plan,
      locale,
    }: {
      formData: ApproxFormData;
      plan: string;
      locale: LangType;
    } = await request.json();

    // Validate locale
    if (!["en", "fr"].includes(locale)) {
      return NextResponse.json(
        { error: "Invalid locale. Must be 'en' or 'fr'" },
        { status: 400 }
      );
    }

    const attachments = prepareAttachments(formData.uploads);
    const transporter = createEmailTransporter();
    const t = translations.approx[locale as LangType];
    const tBusiness = translations.business.approx;

    // Generate email templates
    const clientEmailHtml = createEmailTemplate(
      locale as LangType,
      t.title(plan),
      generateClientEmailContent(formData, plan, locale as LangType)
    );

    const businessEmailHtml = createEmailTemplate(
      "fr",
      tBusiness.title,
      generateBusinessEmailContent(formData, plan, locale as LangType)
    );

    // Send email to client
    await transporter.sendMail({
      from: `"Adhenna Tattoo" <${process.env.EMAIL_BUSINESS}>`,
      to: formData.email,
      subject: t.subject(plan),
      html: clientEmailHtml,
      attachments,
    });

    // Send email to business
    await transporter.sendMail({
      from: `"Adhenna ${plan} Approximatif" <${process.env.EMAIL_BUSINESS}>`,
      to: process.env.EMAIL_BUSINESS,
      subject: tBusiness.subject(
        plan,
        formData.firstName,
        formData.lastName,
        locale
      ),
      html: businessEmailHtml,
      attachments,
    });

    return NextResponse.json({
      message: "Emails sent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error sending approx form emails:", error);

    return NextResponse.json(
      {
        error: "Failed to send emails",
        details: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}
