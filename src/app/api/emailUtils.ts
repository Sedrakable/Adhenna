import nodemailer from "nodemailer";
import { EncodedFileType } from "@/components/reuse/Form/formTypes";
import emailStyles from "./emailStyles";
import { LangType } from "@/i18n/request";

// ==================== CONFIGURATION ====================

// Validate required environment variables
const validateEnvVars = () => {
  if (!process.env.EMAIL_BUSINESS || !process.env.EMAIL_PASS) {
    throw new Error(
      "Missing required environment variables: EMAIL_BUSINESS and/or EMAIL_PASS"
    );
  }
};

// Create and export a singleton transporter instance
export const createEmailTransporter = () => {
  validateEnvVars();

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_BUSINESS,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// ==================== CONSTANTS ====================

// Maximum file size: 10MB
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// ==================== STYLES ====================

// ==================== ATTACHMENT HELPERS ====================

/**
 * Prepare file attachments for email
 * Validates file size and converts base64 to buffer
 */
export const prepareAttachments = (attachments: EncodedFileType[]) => {
  return attachments.map((attach) => {
    // Validate file size
    const fileSize = Buffer.from(attach.data, "base64").length;
    if (fileSize > MAX_FILE_SIZE) {
      throw new Error(
        `File ${attach.name} exceeds maximum size of ${
          MAX_FILE_SIZE / 1024 / 1024
        }MB`
      );
    }

    return {
      filename: attach.name,
      content: Buffer.from(attach.data, "base64"),
      contentType: attach.type,
    };
  });
};

// ==================== CURRENCY HELPERS ====================

export const formatCurrency = (num: number): string => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

// ==================== EMAIL TEMPLATE WRAPPER ====================

export const createEmailTemplate = (
  locale: LangType,
  title: string,
  content: string
): string => {
  return `
    <!DOCTYPE html>
    <html lang="${locale}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
      <style>
        ${emailStyles}
      </style>
    </head>
    <body>
      <div class="container">
        ${content}
      </div>
    </body>
    </html>
  `;
};
