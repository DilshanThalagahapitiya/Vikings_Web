export const APP_NAME = 'VIKINGS';
export const CURRENCY = 'Rs.';

/** Blank-shirt cost used only when a code has no average cost in the stock CSV. */
export const FALLBACK_BLANK_COST = 750;

/** Used when `public/data/settings.json` is missing. Mirrors the POS defaults. */
export const DEFAULT_PRICING = { margin: 0.3, packing: 150, power: 28, roundTo: 50 };

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
