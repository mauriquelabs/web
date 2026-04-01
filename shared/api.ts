/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Contact form submission type
 */
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Contact form response type
 */
export interface ContactFormResponse {
  success: boolean;
  message: string;
}

/**
 * Quote request form submission type
 */
export interface QuoteFormData {
  name: string;
  email: string;
  serviceType: string;
  description: string;
  budgetRange: string;
}

/**
 * Quote request form response type
 */
export interface QuoteFormResponse {
  success: boolean;
  message: string;
}
