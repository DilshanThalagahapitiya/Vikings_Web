import { del, get, set } from 'idb-keyval';
import type { Catalog, CatalogKind } from '../types';
import { PARSERS } from './catalogParsers';

const KINDS: CatalogKind[] = ['designs', 'codes', 'colors', 'stock'];
const OVERRIDE_KEY = 'vikings-catalog-override';

/** Loads the CSV files published with the site (`public/data/*.csv`). */
export async function loadPublishedCatalog(): Promise<Catalog> {
  const entries = await Promise.all(
    KINDS.map(async (kind) => {
      const res = await fetch(`${import.meta.env.BASE_URL}data/${kind}.csv`);
      if (!res.ok) throw new Error(`Could not load ${kind}.csv (${res.status})`);
      return [kind, PARSERS[kind](await res.text())] as const;
    }),
  );
  return Object.fromEntries(entries) as unknown as Catalog;
}

/** Catalog imported through the admin page – only lives in this browser. */
export const loadLocalOverride = () => get<Catalog>(OVERRIDE_KEY).catch(() => undefined);
export const saveLocalOverride = (catalog: Catalog) => set(OVERRIDE_KEY, catalog);
export const clearLocalOverride = () => del(OVERRIDE_KEY);
