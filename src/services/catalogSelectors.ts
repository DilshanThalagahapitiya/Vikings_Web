import { DEFAULT_BLANK_PRICE, FALLBACK_SIZES } from '../config/app';
import { PLACEMENT_BY_ID } from '../config/placements';
import type {
  Catalog,
  Customization,
  Design,
  PlacementId,
  ShirtCode,
  ShirtColor,
  ShirtStyle,
} from '../types';

export interface StyleOption {
  key: ShirtStyle;
  label: string;
}

const STYLE_LABEL: Record<ShirtStyle, string> = {
  regular: 'Regular',
  oversize: 'Oversize',
  collar: 'Regular collar',
};
const STYLE_ORDER: ShirtStyle[] = ['regular', 'oversize', 'collar'];

export function styleOf(code: ShirtCode): ShirtStyle {
  if (code.collar) return 'collar';
  return code.type.toLowerCase().includes('over') ? 'oversize' : 'regular';
}

export function styleOptions(codes: ShirtCode[]): StyleOption[] {
  const present = new Set(codes.map(styleOf));
  return STYLE_ORDER.filter((s) => present.has(s)).map((key) => ({ key, label: STYLE_LABEL[key] }));
}

export const visibleColors = (catalog: Catalog) => catalog.colors.filter((c) => c.visible);

export function colorsForStyle(catalog: Catalog, style: ShirtStyle): ShirtColor[] {
  const names = new Set(catalog.codes.filter((c) => styleOf(c) === style).map((c) => c.color.toLowerCase()));
  return visibleColors(catalog).filter((c) => names.has(c.name.toLowerCase()));
}

export function gsmOptions(codes: ShirtCode[], style: ShirtStyle, color: string): number[] {
  return [
    ...new Set(
      codes
        .filter((c) => styleOf(c) === style && c.color.toLowerCase() === color.toLowerCase())
        .map((c) => c.gsm),
    ),
  ].sort((a, b) => a - b);
}

export function findCode(
  codes: ShirtCode[],
  style: ShirtStyle,
  color: string,
  gsm: number,
): ShirtCode | undefined {
  return codes.find(
    (c) => styleOf(c) === style && c.color.toLowerCase() === color.toLowerCase() && c.gsm === gsm,
  );
}

export interface SizeOption {
  size: string;
  inStock: number;
}

export function sizesForCode(catalog: Catalog, code: ShirtCode): SizeOption[] {
  const rows = catalog.stock.filter((s) => s.code === code.code);
  if (rows.length) return rows.map((r) => ({ size: r.size, inStock: r.inStock }));
  return FALLBACK_SIZES.map((size) => ({ size, inStock: code.inStock }));
}

export const colorByName = (catalog: Catalog, name: string) =>
  catalog.colors.find((c) => c.name.toLowerCase() === name.toLowerCase());

/** Designs that can be printed at the given placement (a price exists for its print size). */
export function designsForPlacement(designs: Design[], placement: PlacementId): Design[] {
  const size = PLACEMENT_BY_ID[placement].printSize;
  return designs.filter((d) => d.prices[size] !== null);
}

export interface PriceLine {
  label: string;
  amount: number;
}

export function priceBreakdown(catalog: Catalog, c: Customization): PriceLine[] {
  const code = catalog.codes.find((x) => x.code === c.code);
  const lines: PriceLine[] = [{ label: `Shirt ${c.code}`, amount: code?.price ?? DEFAULT_BLANK_PRICE }];
  for (const [placementId, designId] of Object.entries(c.prints) as [PlacementId, string][]) {
    const design = catalog.designs.find((d) => d.id === designId);
    const price = design?.prices[PLACEMENT_BY_ID[placementId].printSize];
    if (design && price != null) {
      lines.push({ label: `${design.name} – ${PLACEMENT_BY_ID[placementId].label}`, amount: price });
    }
  }
  return lines;
}

export const unitPrice = (catalog: Catalog, c: Customization) =>
  priceBreakdown(catalog, c).reduce((sum, l) => sum + l.amount, 0);
