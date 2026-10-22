export const APP_NAME = 'VIKINGS';
export const CURRENCY = 'Rs.';

/** Price of a blank shirt when the codes CSV has no `price` value for it. */
export const DEFAULT_BLANK_PRICE = 1200;

/** WhatsApp number (country code, digits only) that receives orders. Empty = copy order text only. */
export const WHATSAPP_NUMBER = '';

/** Sizes shown when a shirt code has no rows in the stock CSV. */
export const FALLBACK_SIZES = ['Small', 'Medium', 'Large', 'XL'];

/** Relative size factor of the 3D shirt per size name (lower-case). */
export const SIZE_SCALE: Record<string, number> = {
  small: 0.92,
  s: 0.92,
  medium: 1,
  m: 1,
  large: 1.08,
  l: 1.08,
  xl: 1.16,
  xxl: 1.24,
};
