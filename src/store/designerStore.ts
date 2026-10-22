import { create } from 'zustand';
import type { PlacementId, PrintChoice, PrintSize, ShirtStyle } from '../types';

interface DesignerState {
  style: ShirtStyle | null;
  color: string | null;
  gsm: number | null;
  size: string | null;
  prints: Partial<Record<PlacementId, PrintChoice>>;
  activePlacement: PlacementId;
  setStyle: (s: ShirtStyle) => void;
  setColor: (c: string) => void;
  setGsm: (g: number) => void;
  setSize: (s: string) => void;
  setActivePlacement: (p: PlacementId) => void;
  setPrint: (p: PlacementId, choice: PrintChoice | null) => void;
  setPrintSize: (p: PlacementId, size: PrintSize) => void;
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
  setPrint: (p, choice) =>
    set((s) => {
      const prints = { ...s.prints };
      if (choice) prints[p] = choice;
      else delete prints[p];
      return { prints };
    }),
  setPrintSize: (p, size) =>
    set((s) => (s.prints[p] ? { prints: { ...s.prints, [p]: { ...s.prints[p]!, size } } } : s)),
  resetPrints: () => set({ prints: {} }),
}));
