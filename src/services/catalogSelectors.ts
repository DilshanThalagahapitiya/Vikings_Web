import { FALLBACK_SIZES } from '../config/app';
import { sizesAt } from './pricing';
import type {
  Catalog,
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

/** Designs offered (priced) in at least one print size allowed at the placement. */
export const designsForPlacement = (designs: Design[], placement: PlacementId): Design[] =>
  designs.filter((d) => sizesAt(d, placement).length > 0);
