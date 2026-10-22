export type PrintSize = 'small' | 'medium' | 'large';

export type PlacementId = 'front-left' | 'front-middle' | 'back-middle' | 'back-full';

/** Geometry family used by the 3D viewer. */
export type ShirtStyle = 'regular' | 'oversize' | 'collar';

export interface Design {
  id: string;
  name: string;
  /** Print cost per size (what the shop pays). `null` means the design is not offered in that size. */
  costs: Record<PrintSize, number | null>;
  /** File name inside `public/designs/` (used when no embedded image). */
  imageFile: string;
  /** Embedded `data:` URL – set for designs imported with an `image_data` column. */
  imageData?: string;
}

export interface ShirtCode {
  code: string;
  /** Raw type text from the CSV, e.g. "Regular" / "Oversize". */
  type: string;
  collar: boolean;
  color: string;
  gsm: number;
  inStock: number;
}

export interface ShirtColor {
  name: string;
  hex: string;
  /** Optional secondary colour (collar / neck-band trim). */
  hex2?: string;
  visible: boolean;
}

export interface StockRow {
  code: string;
  size: string;
  inStock: number;
  avgCost: number;
}

/** Same pricing rules as the Vikings POS "Sell" screen. */
export interface PricingSettings {
  /** Profit margin, e.g. 0.3 = 30 %. */
  margin: number;
  /** Packing cost per shirt. */
  packing: number;
  /** Heat-press power cost per shirt. */
  power: number;
  /** Final price is rounded up to a multiple of this (0 = no rounding). */
  roundTo: number;
}

export interface Catalog {
  designs: Design[];
  codes: ShirtCode[];
  colors: ShirtColor[];
  stock: StockRow[];
  settings: PricingSettings;
}

export type CatalogKind = keyof Catalog;

export interface PrintChoice {
  designId: string;
  size: PrintSize;
}

/** What the customer has configured in the studio. */
export interface Customization {
  code: string;
  size: string;
  /** Selected design and print size per placement. */
  prints: Partial<Record<PlacementId, PrintChoice>>;
}

export interface CartItem extends Customization {
  id: string;
  quantity: number;
}
