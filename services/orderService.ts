import { db } from "@/services/firebase";
import { CartItem } from "@/utils/cartStore";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
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

// Create new order
export const createOrder = async (
  order: Omit<Order, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
  try {
    const ordersCollection = collection(db, "orders");
    const docRef = await addDoc(ordersCollection, {
      ...order,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get user orders
export const getUserOrders = async (uid: string): Promise<Order[]> => {
  try {
    const ordersCollection = collection(db, "orders");
    const q = query(
      ordersCollection,
      where("uid", "==", uid),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Order,
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
};
