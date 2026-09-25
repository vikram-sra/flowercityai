// Public values only. Never put secrets into VITE_ environment variables.
const hostedEnquiry = 'https://docs.google.com/forms/d/e/1FAIpQLSdFKWq1ojAeCN217B0BKPIlvlt4LUUxuhxf0WmGqXTq5eNVaQ/viewform';
function httpsUrl(value) {
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; }
  catch { return ''; }
}
const booking = httpsUrl(import.meta.env.VITE_BOOKING_URL || '');
export const HAS_BOOKING = Boolean(booking);
export const CONTACT_URL = booking || hostedEnquiry;
export const CONTACT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(import.meta.env.VITE_CONTACT_EMAIL || '') ? import.meta.env.VITE_CONTACT_EMAIL : '';
export const FOUNDER_NAME = (import.meta.env.VITE_FOUNDER_NAME || '').trim();
