import { create } from "zustand";

export interface FavouriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface FavouritesStore {
  items: FavouriteItem[];
  addFavourite: (item: FavouriteItem) => void;
  removeFavourite: (id: string) => void;
  toggleFavourite: (item: FavouriteItem) => void;
  isFavourite: (id: string) => boolean;
  getCount: () => number;
}

export const useFavouritesStore = create<FavouritesStore>((set, get) => ({
  items: [],
  addFavourite: (item) =>
    set((state) => ({
      items: state.items.find((i) => i.id === item.id)
        ? state.items
        : [...state.items, item],
    })),
  removeFavourite: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  toggleFavourite: (item) =>
    set((state) => {
      const exists = state.items.find((i) => i.id === item.id);
      return {
        items: exists
          ? state.items.filter((i) => i.id !== item.id)
          : [...state.items, item],
      };
    }),
  isFavourite: (id) => !!get().items.find((i) => i.id === id),
  getCount: () => get().items.length,
}));

export default useFavouritesStore;
