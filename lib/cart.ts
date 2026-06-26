'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: 'product' | 'pack';
}

const DELIVERY_FEE = 35;

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotal: () => number;
  getCount: () => number;
  getDeliveryFee: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        const existing = get().items.find((entry) => entry.id === item.id);
        if (existing) {
          set((state) => ({
            items: state.items.map((entry) =>
              entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry
            ),
            isOpen: true
          }));
        } else {
          set((state) => ({ items: [...state.items, { ...item, quantity: 1 }], isOpen: true }));
        }
      },
      removeItem: (id) => set((state) => ({ items: state.items.filter((entry) => entry.id !== id) })),
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set((state) => ({ items: state.items.filter((entry) => entry.id !== id) }));
          return;
        }
        set((state) => ({
          items: state.items.map((entry) => (entry.id === id ? { ...entry, quantity } : entry))
        }));
      },
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      getTotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      getCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getDeliveryFee: () => DELIVERY_FEE
    }),
    { name: 'summer-cart' }
  )
);

export const DELIVERY_FEE_CONST = DELIVERY_FEE;
