import Papa from 'papaparse';

export type CsvRow = Record<string, string>;

/** Parses CSV text (BOM-safe) into rows keyed by trimmed lower-case header. */
export function parseCsv(text: string): CsvRow[] {
  const result = Papa.parse<CsvRow>(text.replace(/^﻿/, ''), {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (h) => h.trim().toLowerCase(),
  });
  return result.data.map((row) =>
    Object.fromEntries(Object.entries(row).map(([k, v]) => [k, (v ?? '').toString().trim()])),
  );
}

/** Serialises rows to CSV with a UTF-8 BOM so Excel opens it correctly. */
export function toCsv(columns: string[], rows: (string | number | null | undefined)[][]): string {
  const csv = Papa.unparse({ fields: columns, data: rows.map((r) => r.map((v) => v ?? '')) });
  return '﻿' + csv;
}

export function numberOrNull(value: string | undefined): number | null {
  if (value === undefined || value.trim() === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
