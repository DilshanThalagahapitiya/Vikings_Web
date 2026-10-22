import type { PlacementId, PrintSize } from '../types';

export interface PlacementConfig {
  id: PlacementId;
  label: string;
  side: 'front' | 'back';
  /** Which design price column applies to this placement. */
  printSize: PrintSize;
  /** Print box in metres on a medium shirt (images are fitted inside, aspect preserved). */
  box: { width: number; height: number };
  /** Centre of the print: x offset and distance below the shoulder line (metres, medium shirt). */
  anchor: { x: number; drop: number };
}

export const PLACEMENTS: PlacementConfig[] = [
  {
    id: 'front-left',
    label: 'Front left',
    side: 'front',
    printSize: 'small',
    box: { width: 0.09, height: 0.09 },
    anchor: { x: 0.125, drop: 0.17 },
  },
  {
    id: 'front-middle',
    label: 'Front middle',
    side: 'front',
    printSize: 'medium',
    box: { width: 0.28, height: 0.34 },
    anchor: { x: 0, drop: 0.25 },
  },
  {
    id: 'back-middle',
    label: 'Back middle',
    side: 'back',
    printSize: 'medium',
    box: { width: 0.28, height: 0.34 },
    anchor: { x: 0, drop: 0.23 },
  },
  {
    id: 'back-full',
    label: 'Back full',
    side: 'back',
    printSize: 'large',
    box: { width: 0.38, height: 0.5 },
    anchor: { x: 0, drop: 0.31 },
  },
];

export const PLACEMENT_BY_ID = Object.fromEntries(
  PLACEMENTS.map((p) => [p.id, p]),
) as Record<PlacementId, PlacementConfig>;

export const PRINT_SIZE_LABEL: Record<PrintSize, string> = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
};
