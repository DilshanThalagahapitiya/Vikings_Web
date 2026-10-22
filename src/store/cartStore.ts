import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Customization } from '../types';

interface CartState {
  items: CartItem[];
  add: (c: Customization, quantity: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const sameCustomization = (a: Customization, b: Customization) =>
  a.code === b.code && a.size === b.size && JSON.stringify(a.prints) === JSON.stringify(b.prints);

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (c, quantity) =>
        set((s) => {
          const existing = s.items.find((i) => sameCustomization(i, c));
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i,
              ),
            };
          }
          return { items: [...s.items, { ...c, id: crypto.randomUUID(), quantity }] };
        }),
      setQuantity: (id, quantity) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)),
        })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: 'vikings-cart-v2' },
  ),
);
