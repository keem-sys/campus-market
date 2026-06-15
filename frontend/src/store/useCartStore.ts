import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    id: string;
    title: string;
    price: number;
}

interface CartState {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addToCart: (item) => set((state) => ({ items: [...state.items, item] })),

            removeFromCart: (id) => set((state) => ({
                items: state.items.filter((item) => item.id !== id)
            })),

            clearCart: () => set({ items: [] }),

            getTotalPrice: () => {
                const currentItems = get().items;
                return currentItems.reduce((total, item) => total + item.price, 0);
            }
        }),
        {
            name: 'campus-market-cart',
        }
    )
);