import { del, get, set } from 'idb-keyval';
import { DEFAULT_PRICING } from '../config/app';
import type { Catalog, PricingSettings } from '../types';
import { PARSERS, type CsvKind } from './catalogParsers';

const KINDS: CsvKind[] = ['designs', 'codes', 'colors', 'stock'];
const OVERRIDE_KEY = 'vikings-catalog-override-v2';

async function loadSettings(): Promise<PricingSettings> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}data/settings.json`);
    return { ...DEFAULT_PRICING, ...(res.ok ? await res.json() : {}) };
  } catch {
    return DEFAULT_PRICING;
  }
}

/** Loads the CSV files published with the site (`public/data/*.csv`). */
export async function loadPublishedCatalog(): Promise<Catalog> {
  const entries = await Promise.all(
    KINDS.map(async (kind) => {
      const res = await fetch(`${import.meta.env.BASE_URL}data/${kind}.csv`);
      if (!res.ok) throw new Error(`Could not load ${kind}.csv (${res.status})`);
      return [kind, PARSERS[kind](await res.text())] as const;
    }),
  );
  return { ...(Object.fromEntries(entries) as unknown as Omit<Catalog, 'settings'>), settings: await loadSettings() };
}

/** Catalog imported through the admin page – only lives in this browser. */
export const loadLocalOverride = () => get<Catalog>(OVERRIDE_KEY).catch(() => undefined);
export const saveLocalOverride = (catalog: Catalog) => set(OVERRIDE_KEY, catalog);
export const clearLocalOverride = () => del(OVERRIDE_KEY);
