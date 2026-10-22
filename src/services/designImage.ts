import type { Design } from '../types';

export const designImageUrl = (d: Design) =>
  d.imageData ?? `${import.meta.env.BASE_URL}designs/${d.imageFile}`;
