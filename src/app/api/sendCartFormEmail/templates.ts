import { AddressFormData } from "@/components/reuse/Form/formTypes";
import { ICartProduct } from "@/data.d";
import { LangType } from "@/i18n/request";
import { createEmailTemplate, formatCurrency, safeText } from "../emailUtils";
import { translations } from "../emailTranslations";

const calculateOrderTotals = (cart: ICartProduct[], deliveryPrice: number) => {
  const subtotal = cart.reduce(
    (total, item) => total + item.quantity * parseFloat(item.product.price),
    0,
  );
  const taxes = (subtotal + deliveryPrice) * 0.15;
  const grandTotal = subtotal + deliveryPrice + taxes;

  return { subtotal, taxes, grandTotal };
};

const getProductTable = (
  cart: ICartProduct[],
  deliveryPrice: number,
  locale: LangType,
): string => {
  const { subtotal, taxes, grandTotal } = calculateOrderTotals(
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
          <td colspan="3">${t.taxes}</td>
          <td>${formatCurrency(taxes)} $</td>
        </tr>
        <tr class="total">
          <td colspan="3"><strong>${t.grandTotal}</strong></td>
          <td><strong>${formatCurrency(grandTotal)} $</strong></td>
        </tr>
      </tbody>
    </table>
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

export const getCartClientTemplate = (
  formData: AddressFormData,
  cart: ICartProduct[],
  deliveryPrice: number,
  locale: LangType,
): string => {
  const t = translations.cart[locale];

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
): string => {
  const t = translations.business.cart;

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
