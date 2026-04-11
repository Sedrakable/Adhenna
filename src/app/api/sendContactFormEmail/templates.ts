import { ContactFormData } from "@/components/reuse/Form/formTypes";
import { LangType } from "@/i18n/request";
import { createEmailTemplate, safeText } from "../emailUtils";
import { translations } from "../emailTranslations";

export const getContactClientTemplate = (
  formData: ContactFormData,
  locale: LangType,
): string => {
  const t = translations.contact[locale];

  return createEmailTemplate(
    locale,
    t.title,
    `
      <h1>${t.title}</h1>

      <div class="details-section">
        <p>${t.greeting(safeText(formData.firstName))}</p>
        <p>${t.thankYouMessage}</p>
      </div>

      <div class="details-section">
        <div class="detail-item">
          <span class="detail-label">${t.serviceDetails}</span>
          <p>${safeText(formData.plan)}</p>
        </div>

        <div class="detail-item">
          <span class="detail-label">${t.dimensions}</span>
          <p>${safeText(formData.width)}" x ${safeText(formData.length)}"</p>
        </div>

        <div class="detail-item">
          <span class="detail-label">${t.availability}</span>
          <p>${safeText(formData.availabilities)}</p>
        </div>

        ${
          formData.info
            ? `
          <div class="detail-item">
            <span class="detail-label">${t.additionalInfo}</span>
            <p>${safeText(formData.info)}</p>
          </div>
        `
            : ""
        }
      </div>

      <div class="signature">
        ${t.regards}<br>${t.team}
      </div>
    `,
  );
};

export const getContactBusinessTemplate = (
  formData: ContactFormData,
  locale: LangType,
): string => {
  const t = translations.business.contact;

  return createEmailTemplate(
    "fr",
    t.title,
    `
      <h1>${t.title}</h1>

      <div class="details-section">
        <h2>${t.customerInfo}</h2>
        <p>
          <strong>Nom:</strong> ${safeText(formData.firstName)} ${safeText(
      formData.lastName,
    )}<br>
          <strong>Courriel:</strong> ${safeText(formData.email)}<br>
          <strong>Langue:</strong> ${locale.toUpperCase()}<br>
        </p>
      </div>

      <div class="details-section">
        <h2>${t.serviceDetails}</h2>
        <p>
          <strong>${t.service}</strong> ${safeText(formData.service)}<br>
          <strong>${t.plan}</strong> ${safeText(formData.plan)}<br>
          <strong>${t.dimensions}</strong> ${safeText(
      formData.width,
    )}" x ${safeText(formData.length)}"<br>
          <strong>${t.availability}</strong> ${safeText(
      formData.availabilities,
    )}
        </p>

        ${
          formData.info
            ? `
          <h2>${t.additionalInfo}</h2>
          <p>${safeText(formData.info)}</p>
        `
            : ""
        }
      </div>
    `,
  );
};
