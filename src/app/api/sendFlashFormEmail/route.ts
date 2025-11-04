import { FlashFormData } from "@/components/reuse/Form/formTypes";
import { LangType } from "@/i18n/request";
import { NextResponse } from "next/server";
import { createEmailTransporter, createEmailTemplate } from "../emailUtils";
import { translations } from "../emailTranslations";

/**
 * Generate client email content for flash form
 */
const generateClientEmailContent = (
  formData: FlashFormData,
  currentUrl: string,
  locale: LangType
): string => {
  const t = translations.flash[locale];

  return `
    <h1>${t.title}</h1>
    
    <div class="details-section">
      <p>${t.greeting(formData.firstName)}</p>
      <p>${t.thankYouMessage}</p>
    </div>
    
    <div class="details-section">
      <div class="detail-item">
        <span class="detail-label">${t.flashDetails}</span>
        <p>${
          formData.selectedFlash
        } - <a href="${currentUrl}">${currentUrl}</a></p>
      </div>
      
      <div class="detail-item">
        <span class="detail-label">${t.bodyPosition}</span>
        <p>${formData.bodyPosition}</p>
      </div>
      
      <div class="detail-item">
        <span class="detail-label">${t.availability}</span>
        <p>${formData.availabilities}</p>
      </div>
      
      ${
        formData.additionalComments
          ? `
      <div class="detail-item">
        <span class="detail-label">${t.additionalInfo}</span>
        <p>${formData.additionalComments}</p>
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
 * Generate business email content for flash form
 */
const generateBusinessEmailContent = (
  formData: FlashFormData,
  currentUrl: string
): string => {
  const t = translations.business.flash;

  return `
    <h1>${t.title}</h1>
    
    <div class="details-section">
      <h2>${t.customerInfo}</h2>
      <p>
        <strong>${t.name}</strong> ${formData.firstName} ${
    formData.lastName
  }<br>
        <strong>${t.email}</strong> ${formData.email}<br>
        <strong>${
          t.chosenFlash
        }</strong> <a href="${currentUrl}">${currentUrl}</a><br>
      </p>
    </div>

    <div class="details-section">
      <h2>${t.flashDetails}</h2>
      <p>
        <strong>${t.selectedFlash}</strong> ${formData.selectedFlash}<br>
        <strong>${t.bodyPosition}</strong> ${formData.bodyPosition}<br>
        <strong>${t.availability}</strong> ${formData.availabilities}
      </p>
      
      ${
        formData.additionalComments
          ? `
      <h2>${t.additionalComments}</h2>
      <p>${formData.additionalComments}</p>
      `
          : ""
      }
    </div>
  `;
};

/**
 * POST handler for flash form email
 */
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

    // Validate locale
    if (!["en", "fr"].includes(locale)) {
      return NextResponse.json(
        { error: "Invalid locale. Must be 'en' or 'fr'" },
        { status: 400 }
      );
    }

    const transporter = createEmailTransporter();
    const t = translations.flash[locale as LangType];
    const tBusiness = translations.business.flash;

    // Generate email templates
    const clientEmailHtml = createEmailTemplate(
      locale as LangType,
      t.title,
      generateClientEmailContent(formData, currentUrl, locale as LangType)
    );

    const businessEmailHtml = createEmailTemplate(
      "fr",
      tBusiness.title,
      generateBusinessEmailContent(formData, currentUrl)
    );

    // Send email to client
    await transporter.sendMail({
      from: `"Adhenna Tattoo" <${process.env.EMAIL_BUSINESS}>`,
      to: formData.email,
      subject: t.subject,
      html: clientEmailHtml,
    });

    // Send email to business
    await transporter.sendMail({
      from: `"Adhenna Flash" <${process.env.EMAIL_BUSINESS}>`,
      to: process.env.EMAIL_BUSINESS,
      subject: tBusiness.subject(formData.firstName, formData.lastName),
      html: businessEmailHtml,
    });

    return NextResponse.json({
      message: "Emails sent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error sending flash form emails:", error);

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
