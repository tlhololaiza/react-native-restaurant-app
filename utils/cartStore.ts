import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  extras?: { name: string; price: number }[];
  sides?: string;
  drink?: string;
  removedIngredients?: string[];
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  updateItemExtras: (id: string, extras: CartItem["extras"]) => void;
  updateItemSides: (id: string, sides: CartItem["sides"]) => void;
  updateItemRemovedIngredients: (
    id: string,
    removedIngredients: CartItem["removedIngredients"],
  ) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item,
      ),
    })),
  clearCart: () => set({ items: [] }),
  updateItemExtras: (id, extras) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, extras } : item,
      ),
    })),
  updateItemSides: (id, sides) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, sides } : item,
      ),
    })),
  updateItemRemovedIngredients: (id, removedIngredients) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, removedIngredients } : item,
      ),
    })),
  getTotal: () => {
    const items = get().items;
    return items.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      const extrasTotal = item.extras
        ? item.extras.reduce((sum, extra) => sum + extra.price, 0)
        : 0;
      return total + itemTotal + extrasTotal;
    }, 0);
  },
  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
