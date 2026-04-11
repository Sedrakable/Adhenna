import { ApproxFormData } from "@/components/reuse/Form/formTypes";
import { LangType } from "@/i18n/request";
import { createEmailTemplate, safeText } from "../emailUtils";
import { translations } from "../emailTranslations";

export const getApproxClientTemplate = (
  formData: ApproxFormData,
  plan: string,
  locale: LangType,
): string => {
  const t = translations.approx[locale];

  return createEmailTemplate(
    locale,
    t.title(plan),
    `
      <h1>${t.title(plan)}</h1>

      <div class="details-section">
        <p>${t.greeting(safeText(formData.firstName))}</p>
        <p>${t.thankYouMessage(plan)}</p>
      </div>

      <div class="details-section">
        <div class="detail-item">
          <span class="detail-label">${t.dimensions}</span>
          <p>${safeText(formData.width)}" x ${safeText(formData.length)}"</p>
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

export const getApproxBusinessTemplate = (
  formData: ApproxFormData,
  plan: string,
  locale: LangType,
): string => {
  const t = translations.business.approx;

  return createEmailTemplate(
    "fr",
    t.title,
    `
      <h1>${t.title}</h1>

      <div class="details-section">
        <h2>${t.customerInfo}</h2>
        <p>
          <strong>${t.name}</strong> ${safeText(formData.firstName)} ${safeText(
      formData.lastName,
    )}<br>
          <strong>${t.email}</strong> ${safeText(formData.email)}<br>
          <strong>${t.language}</strong> ${locale.toUpperCase()}<br>
        </p>
      </div>

      <div class="details-section">
        <h2>${t.serviceDetails}</h2>
        <p>
          <strong>${t.service}</strong> ${safeText(plan)}<br>
          <strong>${t.dimensions}</strong> ${safeText(
      formData.width,
    )}" x ${safeText(formData.length)}"<br>
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
