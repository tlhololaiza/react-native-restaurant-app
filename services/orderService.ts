import { firestore } from "@/services/firebaseClient";
import { CartItem } from "@/utils/cartStore";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

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

const COLLECTION = "orders";

// Firestore rejects undefined values — strip them from cart items
const sanitizeItems = (items: CartItem[]): CartItem[] =>
  JSON.parse(JSON.stringify(items));

// Create new order
export const createOrder = async (
  order: Omit<Order, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
  try {
    const now = Date.now();
    const ref = await addDoc(collection(firestore, COLLECTION), {
      ...order,
      items: sanitizeItems(order.items),
      createdAt: now,
      updatedAt: now,
    });
    return ref.id;
  } catch (error: any) {
    console.error("createOrder error:", error);
    throw new Error(error.message || String(error));
  }
};

// Get user orders
export const getUserOrders = async (uid: string): Promise<Order[]> => {
  try {
    const q = query(
      collection(firestore, COLLECTION),
      where("uid", "==", uid),
      orderBy("createdAt", "desc"),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
  } catch (error: any) {
    throw new Error(error.message || String(error));
  }
};

// Get a single order by document ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const snap = await getDoc(doc(firestore, COLLECTION, orderId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Order;
  } catch (error: any) {
    throw new Error(error.message || String(error));
  }
};

// Admin: get all orders across all users
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const q = query(
      collection(firestore, COLLECTION),
      orderBy("createdAt", "desc"),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
  } catch (error: any) {
    throw new Error(error.message || String(error));
  }
};

// Admin: update the status of any order
export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"],
): Promise<void> => {
  try {
    await updateDoc(doc(firestore, COLLECTION, orderId), {
      status,
      updatedAt: Date.now(),
    });
  } catch (error: any) {
    throw new Error(error.message || String(error));
  }
};
