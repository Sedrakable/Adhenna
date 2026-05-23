import { AddressFormData } from "@/components/reuse/Form/formTypes";
import { ICartProduct } from "@/data.d";
import { LangType } from "@/i18n/request";
import { createEmailTemplate, formatCurrency, safeText } from "../emailUtils";
import { translations } from "../emailTranslations";

const GST_RATE = 0.05;
const QST_RATE = 0.09975;

const getInvoiceDate = (locale: LangType): string =>
  new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

const calculateOrderTotals = (cart: ICartProduct[], deliveryPrice: number) => {
  const subtotal = cart.reduce(
    (total, item) => total + item.quantity * parseFloat(item.product.price),
    0,
  );
  const taxableTotal = subtotal + deliveryPrice;
  const gst = taxableTotal * GST_RATE;
  const qst = taxableTotal * QST_RATE;
  const grandTotal = taxableTotal + gst + qst;

  return { subtotal, gst, qst, grandTotal };
};

const getProductTable = (
  cart: ICartProduct[],
  deliveryPrice: number,
  locale: LangType,
): string => {
  const { subtotal, gst, qst, grandTotal } = calculateOrderTotals(
    cart,
    deliveryPrice,
  );
  const t = translations.cart[locale];

  return `
    <table>
      <thead>
        <tr>
          <th>${t.product}</th>
          <th>${t.quantity}</th>
          <th>${t.price}</th>
          <th>${t.total}</th>
        </tr>
      </thead>
      <tbody>
        ${cart
          .map(
            (item) => `
          <tr>
            <td>${safeText(item.product.type)} - ${safeText(
              item.product.title,
            )}</td>
            <td>${item.quantity}</td>
            <td>${formatCurrency(parseFloat(item.product.price))} $</td>
            <td>${formatCurrency(
              item.quantity * parseFloat(item.product.price),
            )} $</td>
          </tr>
        `,
          )
          .join("")}
        <tr>
          <td colspan="3"><strong>${t.subtotal}</strong></td>
          <td><strong>${formatCurrency(subtotal)} $</strong></td>
        </tr>
        <tr>
          <td colspan="3">${t.delivery}</td>
          <td>${formatCurrency(deliveryPrice)} $</td>
        </tr>
        <tr>
          <td colspan="3">${t.gst}</td>
          <td>${formatCurrency(gst)} $</td>
        </tr>
        <tr>
          <td colspan="3">${t.qst}</td>
          <td>${formatCurrency(qst)} $</td>
        </tr>
        <tr class="total">
          <td colspan="3"><strong>${t.grandTotal}</strong></td>
          <td><strong>${formatCurrency(grandTotal)} $</strong></td>
        </tr>
      </tbody>
    </table>
  `;
};

const getTaxNumbers = (locale: LangType): string => {
  const t = translations.cart[locale];
  const gstNumber = process.env.EMAIL_GST_NUMBER;
  const qstNumber = process.env.EMAIL_QST_NUMBER;

  if (!gstNumber && !qstNumber) {
    return "";
  }

  return `
    <div class="invoice-tax-numbers">
      ${gstNumber ? `<span>${t.gstNumber}: ${safeText(gstNumber)}</span>` : ""}
      ${qstNumber ? `<span>${t.qstNumber}: ${safeText(qstNumber)}</span>` : ""}
    </div>
  `;
};

const getShippingInfo = (formData: AddressFormData): string => {
  return `
    ${safeText(formData.firstName)} ${safeText(formData.lastName)}<br>
    ${safeText(formData.addressLine1)}<br>
    ${formData.addressLine2 ? `${safeText(formData.addressLine2)}<br>` : ""}
    ${safeText(formData.city)}, ${safeText(formData.state)} ${safeText(
    formData.postalCode,
  )}<br>
    ${safeText(formData.country)}
  `;
};

const getInvoiceHeader = (
  locale: LangType,
  orderNumber: string,
  formData: AddressFormData,
): string => {
  const t = translations.cart[locale];

  return `
    <div class="invoice-header">
      <div>
        <p class="eyebrow">${t.invoice}</p>
        <h1>${t.title}</h1>
      </div>
      <div class="invoice-meta">
        <p><strong>${t.invoiceNumber}</strong><br>${safeText(orderNumber)}</p>
        <p><strong>${t.invoiceDate}</strong><br>${getInvoiceDate(locale)}</p>
      </div>
    </div>

    <div class="invoice-parties">
      <div>
        <h2>${t.seller}</h2>
        <p>Adhenna Tattoo</p>
        ${getTaxNumbers(locale)}
      </div>
      <div>
        <h2>${t.customer}</h2>
        <p>
          ${safeText(formData.firstName)} ${safeText(formData.lastName)}<br>
          ${safeText(formData.email)}
        </p>
      </div>
    </div>
  `;
};

export const getCartClientTemplate = (
  formData: AddressFormData,
  cart: ICartProduct[],
  deliveryPrice: number,
  locale: LangType,
  orderNumber: string,
): string => {
  const t = translations.cart[locale];

  return createEmailTemplate(
    locale,
    t.title,
    `
      ${getInvoiceHeader(locale, orderNumber, formData)}

      <div class="details-section">
        <p>${t.greeting(safeText(formData.firstName))}</p>
        <p>${t.thankYouMessage}</p>
      </div>

      <div class="details-section">
        <h2>${t.orderDetails}</h2>
        ${getProductTable(cart, deliveryPrice, locale)}

        <h2>${t.shippingInfo}</h2>
        <p>${getShippingInfo(formData)}</p>

        <h2>${t.deliveryMethod}</h2>
        <p>${safeText(formData.delivery)}</p>

        ${
          formData.message
            ? `
          <h2>${t.yourMessage}</h2>
          <p>${safeText(formData.message)}</p>
        `
            : ""
        }

        <p><em>${t.trackingInfo}</em></p>
      </div>

      <div class="signature">
        ${t.regards}<br>${t.team}
      </div>
    `,
  );
};

export const getCartBusinessTemplate = (
  formData: AddressFormData,
  cart: ICartProduct[],
  deliveryPrice: number,
  locale: LangType,
  orderNumber: string,
): string => {
  const t = translations.business.cart;

  return createEmailTemplate(
    "fr",
    t.title,
    `
      ${getInvoiceHeader("fr", orderNumber, formData)}

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
        <h2>${t.orderSummary}</h2>
        ${getProductTable(cart, deliveryPrice, locale)}

        <h2>${t.shippingAddress}</h2>
        <p>${getShippingInfo(formData)}</p>

        <h2>${t.deliveryMethod}</h2>
        <p>${safeText(formData.delivery)}</p>

        ${
          formData.message
            ? `
          <h2>${t.customerMessage}</h2>
          <p>${safeText(formData.message)}</p>
        `
            : ""
        }
      </div>
    `,
  );
};
