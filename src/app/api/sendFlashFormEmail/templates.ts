import { FlashFormData } from "@/components/reuse/Form/formTypes";
import { LangType } from "@/i18n/request";
import { createEmailTemplate, safeText } from "../emailUtils";
import { translations } from "../emailTranslations";

export const getFlashClientTemplate = (
  formData: FlashFormData,
  currentUrl: string,
  locale: LangType,
): string => {
  const t = translations.flash[locale];
  const safeUrl = safeText(currentUrl);

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
          <span class="detail-label">${t.flashDetails}</span>
          <p>${safeText(
            formData.selectedFlash,
          )} - <a href="${safeUrl}">${safeUrl}</a></p>
        </div>

        <div class="detail-item">
          <span class="detail-label">${t.bodyPosition}</span>
          <p>${safeText(formData.bodyPosition)}</p>
        </div>

        <div class="detail-item">
          <span class="detail-label">${t.availability}</span>
          <p>${safeText(formData.availabilities)}</p>
        </div>

        ${
          formData.additionalComments
            ? `
          <div class="detail-item">
            <span class="detail-label">${t.additionalInfo}</span>
            <p>${safeText(formData.additionalComments)}</p>
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

export const getFlashBusinessTemplate = (
  formData: FlashFormData,
  currentUrl: string,
): string => {
  const t = translations.business.flash;
  const safeUrl = safeText(currentUrl);

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
          <strong>${
            t.chosenFlash
          }</strong> <a href="${safeUrl}">${safeUrl}</a><br>
        </p>
      </div>

      <div class="details-section">
        <h2>${t.flashDetails}</h2>
        <p>
          <strong>${t.selectedFlash}</strong> ${safeText(
      formData.selectedFlash,
    )}<br>
          <strong>${t.bodyPosition}</strong> ${safeText(
      formData.bodyPosition,
    )}<br>
          <strong>${t.availability}</strong> ${safeText(
      formData.availabilities,
    )}
        </p>

        ${
          formData.additionalComments
            ? `
          <h2>${t.additionalComments}</h2>
          <p>${safeText(formData.additionalComments)}</p>
        `
            : ""
        }
      </div>
    `,
  );
};
