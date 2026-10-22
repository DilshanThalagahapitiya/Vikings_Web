import type { PlacementId, PrintSize } from '../types';

export interface PlacementConfig {
  id: PlacementId;
  label: string;
  side: 'front' | 'back';
  /** Print sizes the customer may choose here. */
  sizes: PrintSize[];
  /** Size pre-selected when a design is picked (falls back to what the design offers). */
  defaultSize: PrintSize;
  /** Centre of the print: x offset and distance below the shoulder line (metres, medium shirt). */
  anchor: { x: number; drop: number };
}

const ALL_SIZES: PrintSize[] = ['small', 'medium', 'large'];

export const PLACEMENTS: PlacementConfig[] = [
  { id: 'front-left', label: 'Front left', side: 'front', sizes: ['small'], defaultSize: 'small', anchor: { x: 0.125, drop: 0.17 } },
  { id: 'front-middle', label: 'Front middle', side: 'front', sizes: ALL_SIZES, defaultSize: 'medium', anchor: { x: 0, drop: 0.25 } },
  { id: 'back-middle', label: 'Back middle', side: 'back', sizes: ALL_SIZES, defaultSize: 'medium', anchor: { x: 0, drop: 0.23 } },
  { id: 'back-full', label: 'Back full', side: 'back', sizes: ['medium', 'large'], defaultSize: 'large', anchor: { x: 0, drop: 0.31 } },
];

export const PLACEMENT_BY_ID = Object.fromEntries(
  PLACEMENTS.map((p) => [p.id, p]),
) as Record<PlacementId, PlacementConfig>;

export const PRINT_SIZE_LABEL: Record<PrintSize, string> = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
};

/** Print box in metres on a medium shirt (images are fitted inside, aspect preserved). */
export const PRINT_BOX: Record<PrintSize, { width: number; height: number }> = {
  small: { width: 0.09, height: 0.09 },
  medium: { width: 0.28, height: 0.34 },
  large: { width: 0.38, height: 0.5 },
};
