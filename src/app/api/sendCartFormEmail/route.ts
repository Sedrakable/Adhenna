//src/app/api/sendCartFormEmail/route.ts
import { AddressFormData } from "@/components/reuse/Form/formTypes";
import { ICartProduct } from "@/data.d";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import routeStyles from "../emailStyles";

// Email translations
const emailTranslations = {
  en: {
    subject: "🌸Thank You for Your Order! - Order Confirmation🌸",
    title: "Thank You for Your Order!",
    greeting: (name: string) => `Dear ${name},`,
    thankYouMessage: () =>
      `Thank you for purchasing from Adhenna! I am excited to confirm that I've received your order and am processing it now. I'll make sure everything is perfect for you.`,
    orderDetails: "Order Details:",
    shippingInfo: "Shipping Information:",
    deliveryMethod: "Delivery Method:",
    yourMessage: "Your Message:",
    trackingInfo:
      "We'll send you another email with tracking information once your package is on its way.",
    regards: "Best regards,",
    team: "Alexia - Adhenna Tattoo",
  },
  fr: {
    subject: "🌸Merci pour votre commande ! - Confirmation de commande🌸",
    title: "Merci pour votre commande !",
    greeting: (name: string) => `Cher/Chère ${name},`,
    thankYouMessage: () =>
      `Merci d’avoir précommandé les produits Adhenna Tattoo! Vous recevrez bientôt un courriel avec les détails pour le paiement et la date de livraison. `,
    orderDetails: "Détails de la commande :",
    shippingInfo: "Informations de livraison :",
    deliveryMethod: "Méthode de livraison :",
    yourMessage: "Votre message :",
    trackingInfo:
      "Surveillez votre boîte de réception (et vos pourriels, au besoin).",
    regards: "Cordialement,",
    team: "Alexia - Adhenna Tattoo",
  },
};

// Helper function to format currency
const formatCurrency = (num: number) => Math.round(num * 100) / 100;

// Helper function to calculate order total
const calculateTotal = (cart: ICartProduct[]): number => {
  const cartTotal = cart.reduce(
    (total, item) => total + item.quantity * parseFloat(item.product.price),
    0
  );
  return cartTotal;
};

// Generate the product table HTML
const generateProductTable = (
  cart: ICartProduct[],
  deliveryPrice: number
): string => {
  const subTotal = calculateTotal(cart);
  const taxes = (subTotal + deliveryPrice) * 0.15; // Example tax rate, adjust as needed
  const grandTotal = subTotal + deliveryPrice + taxes;

  return `
    <table>
      <tr>
        <th>Product</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
      ${cart
        .map(
          (item) => `
        <tr>
          <td>${item.product.type} - ${item.product.title}</td>
          <td>${item.quantity}</td>
          <td>${formatCurrency(parseFloat(item.product.price))}</td>
          <td>${formatCurrency(
            item.quantity * parseFloat(item.product.price)
          )}</td>
        </tr>
      `
        )
        .join("")}
        <tr class="total">
          <td colspan="3">Sous-total</td>
          <td>${formatCurrency(subTotal)} </td>
        </tr>
        <tr>
          <td colspan="3">Delivery</td>
          <td>${formatCurrency(deliveryPrice)}</td>
        </tr>
        <tr>
          <td colspan="3">Taxes</td>
          <td>${formatCurrency(taxes)}</td>
        </tr>
      <tr class="total">
        <td colspan="3">Total</td>
        <td>${formatCurrency(grandTotal)}</td>
      </tr>
    </table>
  `;
};

// Generate shipping information HTML
const generateShippingInfo = (formData: AddressFormData): string => {
  return `
    ${formData.firstName} ${formData.lastName}<br>
    ${formData.addressLine1}<br>
    ${formData.addressLine2 ? `${formData.addressLine2}<br>` : ""}
    ${formData.city}, ${formData.state} ${formData.postalCode}<br>
    ${formData.country}
  `;
};

// Generate client email template based on locale
const generateClientEmailTemplate = (
  formData: AddressFormData,
  cart: ICartProduct[],
  deliveryPrice: number,
  locale: "en" | "fr"
): string => {
  const t = emailTranslations[locale];

  return `
    <!DOCTYPE html>
    <html lang="${locale}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.title}</title>
      <style>
      ${routeStyles}
      </style>

    </head>
    <body>
      <div class="container">
        <h1>${t.title}</h1>
        
        <div class="thank-you">
          <p>${t.greeting(formData.firstName)}</p>
          <p>${t.thankYouMessage()}</p>
        </div>
        
        <div class="details-section">  
          <h2>${t.orderDetails}</h2>
          ${generateProductTable(cart, deliveryPrice)}
          
          <h2>${t.shippingInfo}</h2>
          <p>${generateShippingInfo(formData)}</p>
          
          <h2>${t.deliveryMethod}</h2>
          <p>${formData.delivery}</p>

          ${
            formData.message
              ? `<h2>${t.yourMessage}</h2>
                <p>${formData.message}</p>`
              : ""
          }
          <p>${t.trackingInfo}</p>
        </div>        
        <span class="detail-label">${t.regards}<br>${t.team}</span>
      </div>
    </body>
    </html>
  `;
};
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
      locale = "en",
    }: RequestData = await request.json();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_BUSINESS,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Generate client email template based on locale
    const clientEmailTemplate = generateClientEmailTemplate(
      formData,
      cart,
      deliveryPrice,
      locale
    );

    // Business Email Template (remains in English)
    const businessEmailTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Received</title>
        <style>
        ${routeStyles}
        </style>
      </head>
      <body>
        <div class="container">
          <h1>New Order Received</h1>
          
          <div class="order-info">
            <h2>Customer Information:</h2>
            <p>
              Name: ${formData.firstName} ${formData.lastName}<br>
              Email: ${formData.email}<br>
              Language: ${locale.toUpperCase()}<br>
            </p>
          </div>
          
          <h2>Order Summary:</h2>
          ${generateProductTable(cart, deliveryPrice)}
          
          <h2>Shipping Address:</h2>
          <p>${generateShippingInfo(formData)}</p>
          
          <h2>Delivery Method:</h2>
          <p>${formData.delivery}</p>

          ${
            formData.message
              ? `<h2>Customer Message:</h2>
                 <p>${formData.message}</p>`
              : ""
          }
        </div>
      </body>
      </html>
    `;

    // Send email to client
    await transporter.sendMail({
      from: `"Adhenna Order" <${process.env.EMAIL_BUSINESS}>`,
      to: formData.email,
      subject: emailTranslations[locale].subject,
      html: clientEmailTemplate,
    });

    // Send email to business
    await transporter.sendMail({
      from: `"Adhenna Cart Order" <${process.env.EMAIL_BUSINESS}>`,
      to: process.env.EMAIL_BUSINESS,
      subject: `🌸New Order - ${formData.firstName} ${
        formData.lastName
      } (${locale.toUpperCase()})🌸`,
      html: businessEmailTemplate,
    });

    return NextResponse.json({ message: "Emails sent successfully" });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Failed to send emails", details: error.message },
      { status: 500 }
    );
  }
}
