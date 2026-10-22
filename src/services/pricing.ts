import { FALLBACK_BLANK_COST } from '../config/app';
import { PLACEMENT_BY_ID } from '../config/placements';
import type { Catalog, Customization, Design, PlacementId, PrintSize } from '../types';

/**
 * Same rules as the Vikings POS Sell screen:
 *   unit cost = blank shirt avg cost + print costs + packing + power
 *   price     = unit cost × (1 + margin), rounded up to `roundTo`.
 * Customers only see the final price; the margin is spread over the lines.
 */

export interface PriceLine {
  label: string;
  amount: number;
}

export interface Quote {
  lines: PriceLine[];
  total: number;
}

export function blankCost(catalog: Catalog, code: string, size: string): number {
  const rows = catalog.stock.filter((s) => s.code === code && s.avgCost > 0);
  const exact = rows.find((s) => s.size.toLowerCase() === size.toLowerCase());
  if (exact) return exact.avgCost;
  if (rows.length) return rows.reduce((sum, r) => sum + r.avgCost, 0) / rows.length;
  return FALLBACK_BLANK_COST;
}

/** Print sizes a design is offered in. */
export const offeredSizes = (d: Design): PrintSize[] =>
  (['small', 'medium', 'large'] as PrintSize[]).filter((s) => d.costs[s] !== null);

/** Sizes of a design that may be used at a placement. */
export const sizesAt = (d: Design, placement: PlacementId): PrintSize[] =>
  offeredSizes(d).filter((s) => PLACEMENT_BY_ID[placement].sizes.includes(s));

/** Default size when a design is picked for a placement (like the POS `bestSize`). */
export function defaultSizeFor(d: Design, placement: PlacementId): PrintSize | undefined {
  const allowed = sizesAt(d, placement);
  const preferred = PLACEMENT_BY_ID[placement].defaultSize;
  return allowed.includes(preferred) ? preferred : allowed.includes('medium') ? 'medium' : allowed[0];
}

/** Selling price of one print, margin included (what the customer sees). */
export const printPrice = (catalog: Catalog, d: Design, size: PrintSize) =>
  Math.round((d.costs[size] ?? 0) * (1 + catalog.settings.margin));

export function quote(catalog: Catalog, c: Customization): Quote {
  const { margin, packing, power, roundTo } = catalog.settings;
  const entries = (Object.entries(c.prints) as [PlacementId, NonNullable<Customization['prints'][PlacementId]>][])
    .map(([placement, choice]) => ({ placement, choice, design: catalog.designs.find((d) => d.id === choice.designId) }))
    .filter((e): e is typeof e & { design: Design } => !!e.design && e.design.costs[e.choice.size] !== null);

  const printCost = entries.reduce((sum, e) => sum + (e.design.costs[e.choice.size] ?? 0), 0);
  const unitCost = blankCost(catalog, c.code, c.size) + packing + power + printCost;
  const raw = unitCost * (1 + margin);
  const total = roundTo > 0 ? Math.ceil(raw / roundTo) * roundTo : Math.round(raw);

  const printLines = entries.map((e) => ({
    label: `${e.design.name} – ${PLACEMENT_BY_ID[e.placement].label} (${e.choice.size})`,
    amount: printPrice(catalog, e.design, e.choice.size),
  }));
  const shirtAmount = total - printLines.reduce((sum, l) => sum + l.amount, 0);
  return { lines: [{ label: `T-shirt ${c.code} (incl. packing & finishing)`, amount: shirtAmount }, ...printLines], total };
}

export const unitPrice = (catalog: Catalog, c: Customization) => quote(catalog, c).total;
