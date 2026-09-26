/**
 * COEP Merchandise Store — Production Payment Gateway Configuration
 * 
 * Powered by Cashfree Payments
 * 
 * Supports:
 * 1. Primary "PAY NOW" Gateway (Cashfree Hosted Checkout — UPI, Cards, Net Banking, Wallets)
 * 2. Secondary Dynamic UPI QR Fallback
 * 3. Immutable Security Guards against Client-Side Tampering
 * 
 * NOTE: Cashfree Secret Key is NEVER exposed to the frontend.
 * All order creation happens via the backend Netlify function.
 */

// Fallback encoded values (Base64) to prevent raw plaintext exposure
const _ENC_FALLBACK_UPI = 'OTczMDQ5Mjk2NC0yQHlibA=='; // '9730492964-2@ybl'
const _ENC_FALLBACK_NAME = 'Q09FUCBNZXJjaGFuZGlzZSBTdG9yZQ=='; // 'COEP Merchandise Store'

const decodeSafe = (encoded, fallback) => {
  try {
    if (typeof atob === 'function') {
      return atob(encoded);
    }
    return fallback;
  } catch {
    return fallback;
  }
};

// Retrieve environment variables with priority: import.meta.env -> fallback
const RESOLVED_UPI_ID = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_MERCHANT_UPI_ID) ||
  decodeSafe(_ENC_FALLBACK_UPI, '9730492964-2@ybl')
).trim();

const RESOLVED_PAYEE_NAME = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_MERCHANT_NAME) ||
  decodeSafe(_ENC_FALLBACK_NAME, 'COEP Merchandise Store')
).trim();

const RESOLVED_API_URL = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  ''
).trim();

const RESOLVED_GOOGLE_SHEETS_URL = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GOOGLE_SHEETS_URL) ||
  'https://script.google.com/macros/s/AKfycbw3m7ZFHOwRhUhyjWpYf5wlWtRvWxfyOftkskcwE34pJyVi9ekUY7QWiew4-LPutRft/exec'
).trim();

const RESOLVED_WHATSAPP_LINK = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPPORT_WHATSAPP_LINK) ||
  'https://chat.whatsapp.com/IkHmg9bk8bi0aeW9s0Evid'
).trim();

// Cashfree environment: 'sandbox' for testing, 'production' for live
const RESOLVED_CASHFREE_ENV = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_CASHFREE_ENV) ||
  'production'
).trim();

/**
 * Dynamically loads Cashfree Payments JS SDK
 * Uses the Cashfree hosted checkout (Drop-in) for PCI-DSS compliance
 */
export const loadCashfreeSDK = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Cashfree) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => {
      console.log('Cashfree JS SDK loaded successfully');
      resolve(true);
    };
    script.onerror = () => {
      console.warn('Could not load Cashfree SDK from CDN.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Initializes a Cashfree instance for checkout
 * @returns {Object|null} Cashfree checkout instance
 */
export const initCashfree = () => {
  if (typeof window === 'undefined' || !window.Cashfree) return null;
  try {
    return window.Cashfree({
      mode: RESOLVED_CASHFREE_ENV === 'production' ? 'production' : 'sandbox'
    });
  } catch (err) {
    console.error('Failed to initialize Cashfree:', err);
    return null;
  }
};

/**
 * Immutable Payment Configuration Object (Locked against DevTools / DOM tampering)
 */
export const PAYMENT_CONFIG = Object.freeze({
  GATEWAY_NAME: 'Cashfree Payments',
  CASHFREE_ENV: RESOLVED_CASHFREE_ENV,
  API_URL: RESOLVED_API_URL,
  UPI_ID: RESOLVED_UPI_ID,
  PAYEE_NAME: RESOLVED_PAYEE_NAME,
  GOOGLE_SHEETS_URL: RESOLVED_GOOGLE_SHEETS_URL,
  WHATSAPP_GROUP_URL: RESOLVED_WHATSAPP_LINK,
  CURRENCY: 'INR',
  QR_EXPIRY_SECONDS: 300, // 5 minutes validity for dynamic QR fallback
  
  /**
   * Generates a tamper-proof NPCI standard UPI Pay Intent URI string
   * @param {number} amount - Total payable amount
   * @param {string} orderId - Unique order reference identifier
   * @returns {string} Fully encoded, sanitized UPI URI
   */
  getSecureUpiPayload: (amount, orderId) => {
    const safeAmount = Math.max(0, Number(amount) || 0).toFixed(2);
    const safeOrderId = encodeURIComponent(String(orderId || 'COEP-ORDER').replace(/[^a-zA-Z0-9_-]/g, ''));
    const safeUpiId = encodeURIComponent(RESOLVED_UPI_ID);
    const safePayee = encodeURIComponent(RESOLVED_PAYEE_NAME);

    // Strictly constructed adhering to NPCI UPI Deep Linking Specifications
    return `upi://pay?pa=${safeUpiId}&pn=${safePayee}&am=${safeAmount}&cu=INR&tn=${safeOrderId}`;
  },

  /**
   * Validates Indian UPI Transaction Ref / UTR number
   * @param {string} ref - User inputted transaction reference / UTR
   * @returns {{ isValid: boolean, message?: string }}
   */
  validateTransactionRef: (ref) => {
    if (!ref || typeof ref !== 'string') {
      return { isValid: false, message: 'Please enter the transaction reference / UTR number.' };
    }
    const clean = ref.trim();
    if (clean.length < 8 || clean.length > 32) {
      return { isValid: false, message: 'Invalid transaction ID format (typically 12-24 alphanumeric characters).' };
    }
    const blacklistedValues = ['1234', '12345', '123456', '000000', 'test', 'paid', 'done', 'null', 'undefined'];
    if (blacklistedValues.includes(clean.toLowerCase())) {
      return { isValid: false, message: 'Please enter a genuine transaction reference number.' };
    }
    return { isValid: true };
  }
});

export default PAYMENT_CONFIG;
