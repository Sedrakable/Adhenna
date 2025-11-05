import { ContactFormData } from "@/components/reuse/Form/formTypes";
import { LangType } from "@/i18n/request";
import { NextResponse } from "next/server";
import {
  createEmailTransporter,
  prepareAttachments,
  createEmailTemplate,
} from "../emailUtils";
import { translations } from "../emailTranslations";

/**
 * Generate client email content for contact form
 */
const generateClientEmailContent = (
  formData: ContactFormData,
  locale: LangType
): string => {
  const t = translations.contact[locale];

  return `
    <h1>${t.title}</h1>
    
    <div class="details-section">
      <p>${t.greeting(formData.firstName)}</p>
      <p>${t.thankYouMessage}</p>
    </div>
    
    <div class="details-section">
      <div class="detail-item">
        <span class="detail-label">${t.serviceDetails}</span>
        <p>${formData.plan}</p>
      </div>
      
      <div class="detail-item">
        <span class="detail-label">${t.dimensions}</span>
        <p>${formData.width}" x ${formData.length}"</p>
      </div>
      
      <div class="detail-item">
        <span class="detail-label">${t.availability}</span>
        <p>${formData.availabilities}</p>
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
 * Generate business email content for contact form
 */
const generateBusinessEmailContent = (
  formData: ContactFormData,
  locale: LangType
): string => {
  const t = translations.business.contact;

  return `
    <h1>${t.title}</h1>
    
    <div class="details-section">
      <h2>${t.customerInfo}</h2>
      <p>
        <strong>Nom:</strong> ${formData.firstName} ${formData.lastName}<br>
        <strong>Courriel:</strong> ${formData.email}<br>
        <strong>Langue:</strong> ${locale.toUpperCase()}<br>
      </p>
    </div>

    <div class="details-section">
      <h2>${t.serviceDetails}</h2>
      <p>
        <strong>${t.service}</strong> ${formData.service}<br>
        <strong>${t.plan}</strong> ${formData.plan}<br>
        <strong>${t.dimensions}</strong> ${formData.width}" x ${
    formData.length
  }"<br>
        <strong>${t.availability}</strong> ${formData.availabilities}
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
 * POST handler for contact form email
 */
export async function POST(request: Request) {
  try {
    const {
      formData,
      locale,
    }: {
      formData: ContactFormData;
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
    const t = translations.contact[locale as LangType];
    const tBusiness = translations.business.contact;

    // Generate email templates
    const clientEmailHtml = createEmailTemplate(
      locale as LangType,
      t.title,
      generateClientEmailContent(formData, locale as LangType)
    );

    const businessEmailHtml = createEmailTemplate(
      "fr",
      tBusiness.title,
      generateBusinessEmailContent(formData, locale as LangType)
    );

    // Send email to client
    await transporter.sendMail({
      from: `"Adhenna Tattoo" <${process.env.EMAIL_BUSINESS}>`,
      to: formData.email,
      subject: t.subject,
      html: clientEmailHtml,
      attachments,
    });

    // Send email to business
    await transporter.sendMail({
      from: `"Adhenna Rendez-vous" <${process.env.EMAIL_BUSINESS}>`,
      to: process.env.EMAIL_BUSINESS,
      subject: tBusiness.subject(formData.firstName, formData.lastName, locale),
      html: businessEmailHtml,
      attachments,
    });

    return NextResponse.json({
      message: "Emails sent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error sending contact form emails:", error);

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
