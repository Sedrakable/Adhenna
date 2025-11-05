import { AddressFormData } from "@/components/reuse/Form/formTypes";
import { ICartProduct } from "@/data.d";
import { NextResponse } from "next/server";
import {
  createEmailTransporter,
  createEmailTemplate,
  formatCurrency,
} from "../emailUtils";
import { LangType } from "@/i18n/request";
import { translations } from "../emailTranslations";

/**
 * Calculate order totals
 */
const calculateOrderTotals = (cart: ICartProduct[], deliveryPrice: number) => {
  const subtotal = cart.reduce(
    (total, item) => total + item.quantity * parseFloat(item.product.price),
    0
  );
  const taxes = (subtotal + deliveryPrice) * 0.15; // 15% tax rate
  const grandTotal = subtotal + deliveryPrice + taxes;

  return { subtotal, taxes, grandTotal };
};

/**
 * Generate product table HTML
 */
const generateProductTable = (
  cart: ICartProduct[],
  deliveryPrice: number,
  locale: LangType
): string => {
  const { subtotal, taxes, grandTotal } = calculateOrderTotals(
    cart,
    deliveryPrice
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
            <td>${item.product.type} - ${item.product.title}</td>
            <td>${item.quantity}</td>
            <td>${formatCurrency(parseFloat(item.product.price))} $</td>
            <td>${formatCurrency(
              item.quantity * parseFloat(item.product.price)
            )} $</td>
          </tr>
        `
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

/**
 * Generate shipping information HTML
 */
const generateShippingInfo = (formData: AddressFormData): string => {
  return `
    ${formData.firstName} ${formData.lastName}<br>
    ${formData.addressLine1}<br>
    ${formData.addressLine2 ? `${formData.addressLine2}<br>` : ""}
    ${formData.city}, ${formData.state} ${formData.postalCode}<br>
    ${formData.country}
  `;
};

/**
 * Generate client email content
 */
const generateClientEmailContent = (
  formData: AddressFormData,
  cart: ICartProduct[],
  deliveryPrice: number,
  locale: LangType
): string => {
  const t = translations.cart[locale];

  return `
    <h1>${t.title}</h1>
    
    <div class="details-section">
      <p>${t.greeting(formData.firstName)}</p>
      <p>${t.thankYouMessage}</p>
    </div>
    
    <div class="details-section">  
      <h2>${t.orderDetails}</h2>
      ${generateProductTable(cart, deliveryPrice, locale)}
      
      <h2>${t.shippingInfo}</h2>
      <p>${generateShippingInfo(formData)}</p>
      
      <h2>${t.deliveryMethod}</h2>
      <p>${formData.delivery}</p>

      ${
        formData.message
          ? `
      <h2>${t.yourMessage}</h2>
      <p>${formData.message}</p>
      `
          : ""
      }
      
      <p><em>${t.trackingInfo}</em></p>
    </div>
    
    <div class="signature">
      ${t.regards}<br>${t.team}
    </div>
  `;
};

/**
 * Generate business email content
 */
const generateBusinessEmailContent = (
  formData: AddressFormData,
  cart: ICartProduct[],
  deliveryPrice: number,
  locale: LangType
): string => {
  const t = translations.business.cart;

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
      <h2>${t.orderSummary}</h2>
      ${generateProductTable(cart, deliveryPrice, locale)}
      
      <h2>${t.shippingAddress}</h2>
      <p>${generateShippingInfo(formData)}</p>
      
      <h2>${t.deliveryMethod}</h2>
      <p>${formData.delivery}</p>

      ${
        formData.message
          ? `
      <h2>${t.customerMessage}</h2>
      <p>${formData.message}</p>
      `
          : ""
      }
    </div>
  `;
};

/**
 * POST handler for cart form email
 */
interface RequestData {
  formData: AddressFormData;
  cart: ICartProduct[];
  deliveryPrice: number;
  locale: "en" | "fr";
}

export async function POST(request: Request) {
  try {
    const {
      formData,
      cart,
      deliveryPrice = 0,
      locale = "fr",
    }: RequestData = await request.json();

    // Validate locale
    if (!["en", "fr"].includes(locale)) {
      return NextResponse.json(
        { error: "Invalid locale. Must be 'en' or 'fr'" },
        { status: 400 }
      );
    }

    // Validate cart
    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const transporter = createEmailTransporter();
    const t = translations.cart[locale as LangType];
    const tBusiness = translations.business.cart;

    // Generate email templates
    const clientEmailHtml = createEmailTemplate(
      locale as LangType,
      t.title,
      generateClientEmailContent(
        formData,
        cart,
        deliveryPrice,
        locale as LangType
      )
    );

    const businessEmailHtml = createEmailTemplate(
      "fr",
      tBusiness.title,
      generateBusinessEmailContent(
        formData,
        cart,
        deliveryPrice,
        locale as LangType
      )
    );

    // Send email to client
    await transporter.sendMail({
      from: `"Adhenna Order" <${process.env.EMAIL_BUSINESS}>`,
      to: formData.email,
      subject: t.subject,
      html: clientEmailHtml,
    });

    // Send email to business
    await transporter.sendMail({
      from: `"Adhenna Cart Order" <${process.env.EMAIL_BUSINESS}>`,
      to: process.env.EMAIL_BUSINESS,
      subject: tBusiness.subject(formData.firstName, formData.lastName, locale),
      html: businessEmailHtml,
    });

    return NextResponse.json({
      message: "Emails sent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error sending cart form emails:", error);

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
