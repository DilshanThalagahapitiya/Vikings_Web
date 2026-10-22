export type PrintSize = 'small' | 'medium' | 'large';

export type PlacementId = 'front-left' | 'front-middle' | 'back-middle' | 'back-full';

/** Geometry family used by the 3D viewer. */
export type ShirtStyle = 'regular' | 'oversize' | 'collar';

export interface Design {
  id: string;
  name: string;
  /** Price per print size. `null` means the design is not offered in that size. */
  prices: Record<PrintSize, number | null>;
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
  /** Optional selling price for the blank shirt. */
  price: number | null;
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

export interface Catalog {
  designs: Design[];
  codes: ShirtCode[];
  colors: ShirtColor[];
  stock: StockRow[];
}

export type CatalogKind = keyof Catalog;

/** What the customer has configured in the studio. */
export interface Customization {
  code: string;
  size: string;
  /** Selected design id per placement. */
  prints: Partial<Record<PlacementId, string>>;
}

export interface CartItem extends Customization {
  id: string;
  quantity: number;
}
