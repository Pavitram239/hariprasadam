/**
 * HariPrasadam Official WhatsApp Utility
 * Phone Number: +91 9909 799369
 * International Format for WhatsApp API: 919909799369
 */

export const HARIPRASADAM_WHATSAPP_PHONE = '919909799369';
export const HARIPRASADAM_DISPLAY_PHONE = '+91 9909 799369';

export function buildWhatsAppUrl(message: string): string {
  const encodedMessage = encodeURIComponent(message.trim());
  return `https://wa.me/${HARIPRASADAM_WHATSAPP_PHONE}?text=${encodedMessage}`;
}

export function getGeneralWhatsAppUrl(): string {
  return buildWhatsAppUrl(
    'Hello HariPrasadam, I would like to know more about your products and gifting collection.'
  );
}

export function getProductWhatsAppUrl(productName: string, flavour?: string): string {
  const name = flavour && !productName.toLowerCase().includes(flavour.toLowerCase())
    ? `${productName} (${flavour})`
    : productName;
  return buildWhatsAppUrl(
    `Hello HariPrasadam, I'm interested in ${name}. Please share more details.`
  );
}

export function getGiftWhatsAppUrl(giftName: string): string {
  return buildWhatsAppUrl(
    `Hello HariPrasadam, I'm interested in ${giftName}. Please share the details.`
  );
}

export function getComboWhatsAppUrl(comboName: string): string {
  return buildWhatsAppUrl(
    `Hello HariPrasadam, I'm interested in ${comboName}. Please share more details.`
  );
}

export function getCorporateWhatsAppUrl(): string {
  return buildWhatsAppUrl(
    "Hello HariPrasadam, I'm interested in corporate gifting. Please share the available options."
  );
}

export function getCustomGiftingWhatsAppUrl(topic?: string): string {
  if (topic) {
    return buildWhatsAppUrl(
      `Hello HariPrasadam, I'm interested in ${topic}. Please share the available options and pricing.`
    );
  }
  return buildWhatsAppUrl(
    "Hello HariPrasadam, I'm looking for custom packaging and jar weight options for dry fruit gifting."
  );
}
