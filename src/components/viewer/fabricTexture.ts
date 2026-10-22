import * as THREE from 'three';

let cached: THREE.CanvasTexture | null = null;

/** Small tiling noise used as a bump map so the cotton does not look like plastic. */
export function getFabricBump(): THREE.CanvasTexture {
  if (cached) return cached;
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const row = Math.floor(i / size);
    const weave = (row % 4 < 2 ? 18 : 0) + Math.random() * 90;
    img.data.set([weave, weave, weave, 255], i * 4);
  }
  ctx.putImageData(img, 0, 0);
  cached = new THREE.CanvasTexture(canvas);
  cached.wrapS = cached.wrapT = THREE.RepeatWrapping;
  return cached;
}
