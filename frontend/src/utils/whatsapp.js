import { config } from '../config/config';

/**
 * Generate WhatsApp message for product enquiry
 */
export const generateProductEnquiry = (product) => {
    const message = `Hi! I'm interested in:\n\n*${product.name}*\n${product.description ? `Description: ${product.description}\n` : ''}${product.price ? `Price: ₹${product.price}\n` : ''}\nProduct Code: ${product.code || product.id}\n\nPlease share more details.`;

    return encodeURIComponent(message);
};

/**
 * Generate WhatsApp message for general enquiry
 */
export const generateGeneralEnquiry = (message) => {
    const defaultMessage = 'Hi! I would like to know more about your products.';
    return encodeURIComponent(message || defaultMessage);
};

/**
 * Generate WhatsApp message for collection enquiry
 */
export const generateCollectionEnquiry = (collection) => {
    const message = `Hi! I'm interested in your *${collection.name}* collection.\n\nPlease share the available products and details.`;
    return encodeURIComponent(message);
};

/**
 * Open WhatsApp with pre-filled message
 */
export const openWhatsApp = (message) => {
    const whatsappNumber = config.whatsappNumber.replace('+', '');
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(url, '_blank');
};

/**
 * Open WhatsApp for product enquiry
 */
export const enquireProduct = (product) => {
    const message = generateProductEnquiry(product);
    openWhatsApp(message);
};

/**
 * Open WhatsApp for collection enquiry
 */
export const enquireCollection = (collection) => {
    const message = generateCollectionEnquiry(collection);
    openWhatsApp(message);
};

/**
 * Open WhatsApp for general enquiry
 */
export const sendGeneralEnquiry = (customMessage) => {
    const message = generateGeneralEnquiry(customMessage);
    openWhatsApp(message);
};
