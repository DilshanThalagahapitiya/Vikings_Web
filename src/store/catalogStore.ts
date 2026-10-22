import { create } from 'zustand';
import type { Catalog, CatalogKind } from '../types';
import {
  clearLocalOverride,
  loadLocalOverride,
  loadPublishedCatalog,
  saveLocalOverride,
} from '../services/catalogApi';
import { PARSERS } from '../services/catalogParsers';

interface CatalogState {
  catalog: Catalog | null;
  status: 'idle' | 'loading' | 'ready' | 'error';
  error?: string;
  /** `local` = admin-imported data that only exists in this browser. */
  source: 'published' | 'local';
  load: () => Promise<void>;
  importCsv: (kind: CatalogKind, text: string) => Promise<number>;
  resetToPublished: () => Promise<void>;
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  catalog: null,
  status: 'idle',
  source: 'published',

  async load() {
    if (get().status === 'loading') return;
    set({ status: 'loading', error: undefined });
    try {
      const local = await loadLocalOverride();
      if (local) return set({ catalog: local, source: 'local', status: 'ready' });
      set({ catalog: await loadPublishedCatalog(), source: 'published', status: 'ready' });
    } catch (e) {
      set({ status: 'error', error: e instanceof Error ? e.message : String(e) });
    }
  },

  async importCsv(kind, text) {
    const current = get().catalog ?? (await loadPublishedCatalog());
    const rows = PARSERS[kind](text);
    if (!rows.length) throw new Error('No valid rows found in this file.');
    const next = { ...current, [kind]: rows } as Catalog;
    await saveLocalOverride(next);
    set({ catalog: next, source: 'local', status: 'ready' });
    return rows.length;
  },

  async resetToPublished() {
    await clearLocalOverride();
    set({ catalog: await loadPublishedCatalog(), source: 'published' });
  },
}));
