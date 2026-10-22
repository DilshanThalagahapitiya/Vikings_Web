import { numberOrNull, parseCsv, toCsv } from '../lib/csv';
import { urlToDataUrl } from '../lib/download';
import type { Catalog, CatalogKind, Design, ShirtCode, ShirtColor, StockRow } from '../types';
import { designImageUrl } from './designImage';

type CsvKind = Exclude<CatalogKind, 'settings'>;
type Parser<K extends CsvKind> = (text: string) => Catalog[K];

export const parseDesigns: Parser<'designs'> = (text) =>
  parseCsv(text)
    .filter((r) => r.id)
    .map((r) => ({
      id: r.id,
      name: r.name || r.id,
      costs: {
        small: numberOrNull(r.small_price),
        medium: numberOrNull(r.medium_price),
        large: numberOrNull(r.large_price),
      },
      imageFile: r.image_file ?? '',
      imageData: r.image_data?.startsWith('data:') ? r.image_data : undefined,
    }));

export const parseCodes: Parser<'codes'> = (text) =>
  parseCsv(text)
    .filter((r) => r.code)
    .map((r) => ({
      code: r.code,
      type: r.type || 'Regular',
      collar: r.collar?.toLowerCase() === 'collar' || r.collar?.toLowerCase() === 'yes',
      color: r.color,
      gsm: Number(r.gsm) || 0,
      inStock: Number(r.in_stock) || 0,
    }));

export const parseColors: Parser<'colors'> = (text) =>
  parseCsv(text)
    .filter((r) => r.name && r.hex)
    .map((r) => ({
      name: r.name,
      hex: r.hex,
      hex2: r.hex2 || undefined,
      visible: (r.status || 'visible').toLowerCase() !== 'hidden',
    }));

export const parseStock: Parser<'stock'> = (text) =>
  parseCsv(text)
    .filter((r) => r.code && r.size)
    .map((r) => ({
      code: r.code,
      size: r.size,
      inStock: Number(r.in_stock) || 0,
      avgCost: Number(r.avg_cost) || 0,
    }));

export type { CsvKind };

export const PARSERS: { [K in CsvKind]: Parser<K> } = {
  designs: parseDesigns,
  codes: parseCodes,
  colors: parseColors,
  stock: parseStock,
};

/** Serialises designs; images are embedded as data URLs so the file is self-contained. */
export async function designsToCsv(designs: Design[]): Promise<string> {
  const rows = await Promise.all(
    designs.map(async (d) => [
      d.id,
      d.name,
      d.costs.small,
      d.costs.medium,
      d.costs.large,
      d.imageFile,
      d.imageData ?? (await urlToDataUrl(designImageUrl(d)).catch(() => '')),
    ]),
  );
  return toCsv(
    ['id', 'name', 'small_price', 'medium_price', 'large_price', 'image_file', 'image_data'],
    rows,
  );
}

export const codesToCsv = (codes: ShirtCode[]) =>
  toCsv(
    ['code', 'type', 'collar', 'color', 'gsm', 'in_stock'],
    codes.map((c) => [
      c.code,
      c.type,
      c.collar ? 'Collar' : 'No collar',
      c.color,
      c.gsm,
      c.inStock,
    ]),
  );

export const colorsToCsv = (colors: ShirtColor[]) =>
  toCsv(
    ['name', 'hex', 'hex2', 'status'],
    colors.map((c) => [c.name, c.hex, c.hex2, c.visible ? 'visible' : 'hidden']),
  );

export const stockToCsv = (stock: StockRow[]) =>
  toCsv(
    ['code', 'size', 'in_stock', 'avg_cost'],
    stock.map((s) => [s.code, s.size, s.inStock, s.avgCost]),
  );
