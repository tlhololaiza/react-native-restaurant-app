import { _storageKeys } from "@/services/firebase";
import { CartItem } from "@/utils/cartStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Order {
  id?: string;
  uid: string;
  userName: string;
  userSurname: string;
  userEmail: string;
  userPhone: string;
  deliveryAddress: string;
  cardNumber: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "delivering"
    | "delivered"
    | "cancelled";
  createdAt: number;
  updatedAt: number;
}

const readJson = async <T>(key: string, fallback: T): Promise<T> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (e) {
    return fallback;
  }
};

const writeJson = async (key: string, value: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

// Create new order
export const createOrder = async (
  order: Omit<Order, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
  try {
    const key = _storageKeys.KEY_ORDERS;
    const orders = await readJson<Order[]>(key, []);
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const newOrder: Order = {
      id,
      ...order,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    orders.push(newOrder);
    await writeJson(key, orders);
    return id;
  } catch (error: any) {
    throw new Error(error.message || String(error));
  }
};

// Get user orders
export const getUserOrders = async (uid: string): Promise<Order[]> => {
  try {
    const key = _storageKeys.KEY_ORDERS;
    const orders = await readJson<Order[]>(key, []);
    return orders
      .filter((o) => o.uid === uid)
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch (error: any) {
    throw new Error(error.message || String(error));
  }
};
