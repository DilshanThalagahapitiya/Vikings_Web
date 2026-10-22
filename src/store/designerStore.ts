import { create } from 'zustand';
import type { PlacementId, ShirtStyle } from '../types';

interface DesignerState {
  style: ShirtStyle | null;
  color: string | null;
  gsm: number | null;
  size: string | null;
  prints: Partial<Record<PlacementId, string>>;
  activePlacement: PlacementId;
  setStyle: (s: ShirtStyle) => void;
  setColor: (c: string) => void;
  setGsm: (g: number) => void;
  setSize: (s: string) => void;
  setActivePlacement: (p: PlacementId) => void;
  setPrint: (p: PlacementId, designId: string | null) => void;
  resetPrints: () => void;
}

export const useDesignerStore = create<DesignerState>((set) => ({
  style: null,
  color: null,
  gsm: null,
  size: null,
  prints: {},
  activePlacement: 'front-middle',
  setStyle: (style) => set({ style }),
  setColor: (color) => set({ color }),
  setGsm: (gsm) => set({ gsm }),
  setSize: (size) => set({ size }),
  setActivePlacement: (activePlacement) => set({ activePlacement }),
  setPrint: (p, designId) =>
    set((s) => {
      const prints = { ...s.prints };
      if (designId) prints[p] = designId;
      else delete prints[p];
      return { prints };
    }),
  resetPrints: () => set({ prints: {} }),
}));
