export const translations = {
  // APPROX FORM TRANSLATIONS
  approx: {
    en: {
      subject: (plan: string) => `🌸${plan} Estimate - Adhenna🌸`,
      title: (plan: string) => `Your ${plan} at Adhenna!`,
      greeting: (name: string) => `Dear ${name},`,
      thankYouMessage: (plan: string) =>
        `Thank you for contacting Adhenna Tattoo! You will soon receive an email with an estimate for your ${plan}. Keep an eye on your inbox (and spam folder, if needed). 😊`,
      dimensions: "Requested Dimensions:",
      additionalInfo: "Additional Information:",
      regards: "Best regards,",
      team: "Alexia - Adhenna Tattoo",
    },
    fr: {
      subject: (plan: string) => `🌸${plan} Approximatif - Adhenna🌸`,
      title: (plan: string) => `Votre ${plan} chez Adhenna!`,
      greeting: (name: string) => `Cher/Chère ${name},`,
      thankYouMessage: (plan: string) =>
        `Merci d'avoir contacté Adhenna Tattoo! Vous recevrez bientôt un courriel avec une soumission pour votre ${plan}. Surveillez votre boîte de réception (et vos pourriels, au besoin). 😊`,
      dimensions: "Dimensions demandées:",
      additionalInfo: "Informations supplémentaires:",
      regards: "Cordialement,",
      team: "Alexia - Adhenna Tattoo",
    },
  },

  // CART FORM TRANSLATIONS
  cart: {
    en: {
      subject: "🌸Thank You for Your Order! - Order Confirmation🌸",
      title: "Thank You for Your Order!",
      greeting: (name: string) => `Dear ${name},`,
      thankYouMessage:
        "Thank you for pre-ordering Adhenna Tattoo products! You will soon receive an email with payment details and delivery date. Keep an eye on your inbox (and spam folder, if needed).",
      orderDetails: "Order Details:",
      shippingInfo: "Shipping Information:",
      deliveryMethod: "Delivery Method:",
      yourMessage: "Your Message:",
      trackingInfo:
        "We'll send you another email with tracking information once your package is on its way.",
      regards: "Best regards,",
      team: "Alexia - Adhenna Tattoo",
      product: "Product",
      quantity: "Quantity",
      price: "Price",
      total: "Total",
      subtotal: "Subtotal",
      delivery: "Delivery",
      taxes: "Taxes",
      invoice: "Invoice / Receipt",
      invoiceNumber: "Invoice no.",
      invoiceDate: "Date",
      seller: "Seller",
      customer: "Customer",
      gst: "GST/TPS 5%",
      qst: "QST/TVQ 9.975%",
      gstNumber: "GST/TPS no.",
      qstNumber: "QST/TVQ no.",
      grandTotal: "Grand Total",
    },
    fr: {
      subject: "🌸Merci pour votre commande ! - Confirmation de commande🌸",
      title: "Merci pour votre commande !",
      greeting: (name: string) => `Cher/Chère ${name},`,
      thankYouMessage:
        "Merci d'avoir précommandé les produits Adhenna Tattoo! Vous recevrez bientôt un courriel avec les détails pour le paiement et la date de livraison. Surveillez votre boîte de réception (et vos pourriels, au besoin).",
      orderDetails: "Détails de la commande :",
      shippingInfo: "Informations de livraison :",
      deliveryMethod: "Méthode de livraison :",
      yourMessage: "Votre message :",
      trackingInfo:
        "Surveillez votre boîte de réception (et vos pourriels, au besoin).",
      regards: "Cordialement,",
      team: "Alexia - Adhenna Tattoo",
      product: "Produit",
      quantity: "Quantité",
      price: "Prix",
      total: "Total",
      subtotal: "Sous-total",
      delivery: "Livraison",
      taxes: "Taxes",
      invoice: "Facture / Reçu",
      invoiceNumber: "No de facture",
      invoiceDate: "Date",
      seller: "Vendeur",
      customer: "Client",
      gst: "TPS/GST 5%",
      qst: "TVQ/QST 9,975%",
      gstNumber: "No TPS/GST",
      qstNumber: "No TVQ/QST",
      grandTotal: "Total",
    },
  },

  // CONTACT FORM TRANSLATIONS
  contact: {
    en: {
      subject: "🌸Appointment Confirmation🌸",
      title: "Your appointment at Adhenna!",
      greeting: (name: string) => `Dear ${name},`,
      thankYouMessage:
        "Thank you for contacting Adhenna Tattoo for your next henna or permanent tattoo project! We will send you an email soon to schedule a date to create your artwork. Keep an eye on your inbox (and spam folder, if needed). 😊",
      serviceDetails: "Service Details:",
      dimensions: "Requested Dimensions:",
      availability: "Availability:",
      additionalInfo: "Additional Information:",
      regards: "Best regards,",
      team: "Alexia - Adhenna Tattoo",
    },
    fr: {
      subject: "🌸Confirmation de rendez-vous🌸",
      title: "Votre rendez-vous chez Adhenna!",
      greeting: (name: string) => `Cher/Chère ${name},`,
      thankYouMessage:
        "Merci d'avoir contacté Adhenna Tattoo pour votre prochain projet de henné ou de tatouage permanent ! Nous vous enverrons bientôt un courriel pour fixer une date afin de réaliser votre œuvre. Surveillez votre boîte de réception (et vos pourriels, au besoin). 😊",
      serviceDetails: "Détails du service:",
      dimensions: "Dimensions demandées:",
      availability: "Disponibilités:",
      additionalInfo: "Informations supplémentaires:",
      regards: "Cordialement,",
      team: "Alexia - Adhenna Tattoo",
    },
  },

  // FLASH FORM TRANSLATIONS
  flash: {
    en: {
      subject: "🌸Flash Tattoo Booking🌸",
      title: "Your Flash booking at Adhenna!",
      greeting: (name: string) => `Dear ${name},`,
      thankYouMessage:
        "Thank you for booking a flash with Adhenna Tattoo! An email will be sent to you shortly to schedule an appointment. Keep an eye on your inbox (and spam folder, if needed). 😊",
      flashDetails: "Selected Flash:",
      bodyPosition: "Body Position:",
      availability: "Availability:",
      additionalInfo: "Additional Comments:",
      regards: "Best regards,",
      team: "Alexia - Adhenna Tattoo",
    },
    fr: {
      subject: "🌸Réservation de Flash Tattoo🌸",
      title: "Votre réservation de Flash chez Adhenna!",
      greeting: (name: string) => `Cher/Chère ${name},`,
      thankYouMessage:
        "Merci d'avoir réservé un flash avec Adhenna Tattoo! Un courriel vous sera envoyé sous peu pour fixer un rendez-vous. Surveillez votre boîte de réception (et vos pourriels, au besoin). 😊",
      flashDetails: "Flash sélectionné:",
      bodyPosition: "Position sur le corps:",
      availability: "Disponibilités:",
      additionalInfo: "Commentaires additionnels:",
      regards: "Cordialement,",
      team: "Alexia - Adhenna Tattoo",
    },
  },

  // BUSINESS EMAIL TRANSLATIONS (always in French)
  business: {
    approx: {
      subject: (
        plan: string,
        firstName: string,
        lastName: string,
        locale: string
      ) =>
        `🌸${plan} Approximatif - ${firstName} ${lastName} (${locale.toUpperCase()})🌸`,
      title: "Nouvelle demande de consultation",
      customerInfo: "Informations client:",
      name: "Nom:",
      email: "Courriel:",
      language: "Langue:",
      serviceDetails: "Détails du service:",
      service: "Service:",
      plan: "Plan:",
      dimensions: "Dimensions:",
      additionalInfo: "Informations supplémentaires:",
    },
    cart: {
      subject: (firstName: string, lastName: string, locale: string) =>
        `🌸Nouvelle commande - ${firstName} ${lastName} (${locale.toUpperCase()})🌸`,
      title: "Nouvelle commande reçue",
      customerInfo: "Informations client:",
      orderSummary: "Résumé de la commande:",
      shippingAddress: "Adresse de livraison:",
      deliveryMethod: "Méthode de livraison:",
      customerMessage: "Message du client:",
    },
    contact: {
      subject: (firstName: string, lastName: string, locale: string) =>
        `🌸Nouveau rendez-vous - ${firstName} ${lastName} (${locale.toUpperCase()})🌸`,
      title: "Nouvelle demande de consultation",
      customerInfo: "Informations client:",
      serviceDetails: "Détails du service:",
      service: "Service:",
      plan: "Plan:",
      dimensions: "Dimensions:",
      availability: "Disponibilités:",
      additionalInfo: "Informations supplémentaires:",
    },
    flash: {
      subject: (firstName: string, lastName: string) =>
        `🌸Nouvelle réservation Flash - ${firstName} ${lastName}🌸`,
      title: "Nouvelle demande de Flash Tattoo",
      customerInfo: "Informations client:",
      name: "Nom:",
      email: "Courriel:",
      chosenFlash: "Flash choisi:",
      flashDetails: "Détails du Flash Tattoo:",
      selectedFlash: "Flash sélectionné:",
      bodyPosition: "Position sur le corps:",
      availability: "Disponibilités:",
      additionalComments: "Commentaires additionnels:",
    },
  },
};
