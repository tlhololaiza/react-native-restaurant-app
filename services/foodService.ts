import { db } from "@/services/firebase";
import {
  addDoc,
  collection,
  getDocs,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";

export type FoodCategory =
  | "burgers"
  | "pizza"
  | "chicken"
  | "desserts"
  | "drinks"
  | "sides"
  | "mains"
  | "starters";

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: FoodCategory;
  rating?: number;
  reviews?: number;
  createdAt: number;
  updatedAt: number;
}

const COLLECTION = "foods";

// Mock data fallback (used when Firestore is unavailable)
const MOCK_FOOD_ITEMS: FoodItem[] = [
  {
    id: "1",
    name: "Classic Burger",
    description:
      "Beef patty, cheddar, lettuce, tomato, house sauce on brioche.",
    price: 89,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
    category: "burgers",
    rating: 4.5,
    reviews: 234,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "2",
    name: "Margarita Pizza",
    description: "Tomato, fresh mozzarella, basil, extra virgin olive oil.",
    price: 129,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=800&h=600&fit=crop",
    category: "pizza",
    rating: 4.7,
    reviews: 156,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "3",
    name: "Spicy Fried Chicken",
    description: "Crispy fried chicken with house spice blend and pickles.",
    price: 99,
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd097cfd83e?w=800&h=600&fit=crop",
    category: "chicken",
    rating: 4.6,
    reviews: 198,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "4",
    name: "Chocolate Cake",
    description: "Rich chocolate sponge, ganache frosting, cocoa nib crunch.",
    price: 59,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop",
    category: "desserts",
    rating: 4.8,
    reviews: 142,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "5",
    name: "Fresh Juice",
    description: "Cold-pressed seasonal fruits, no added sugar.",
    price: 29,
    image:
      "https://images.unsplash.com/photo-1599599810694-f3f465b6ee0d?w=800&h=600&fit=crop",
    category: "drinks",
    rating: 4.4,
    reviews: 88,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "6",
    name: "Double Cheeseburger",
    description: "Double beef patties, double cheddar, caramelized onions.",
    price: 119,
    image:
      "https://images.unsplash.com/photo-1571115764595-644a12c7cb72?w=800&h=600&fit=crop",
    category: "burgers",
    rating: 4.6,
    reviews: 210,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export const getFoodItems = async (): Promise<FoodItem[]> => {
  try {
    console.log("getFoodItems: Fetching from collection:", COLLECTION);
    const snapshot = await getDocs(collection(db, COLLECTION));
    console.log("getFoodItems: Found", snapshot.docs.length, "documents");

    if (snapshot.docs.length === 0) {
      console.warn("getFoodItems: No documents in Firestore, using mock data");
      return MOCK_FOOD_ITEMS;
    }

    const items = snapshot.docs.map(mapDocToFoodItem);
    console.log("getFoodItems: Mapped items:", items);
    return items;
  } catch (error) {
    console.error(
      "getFoodItems: Error fetching items, falling back to mock data:",
      error,
    );
    // Return mock data when Firestore fails (e.g., blocked by ad blocker)
    return MOCK_FOOD_ITEMS;
  }
};

export const addFoodItem = async (
  item: Omit<FoodItem, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...item,
    createdAt: Timestamp.now().toMillis(),
    updatedAt: Timestamp.now().toMillis(),
  });
  return docRef.id;
};

export const seedFoodItems = async () => {
  const seed: Omit<FoodItem, "id" | "createdAt" | "updatedAt">[] = [
    {
      name: "Classic Burger",
      description:
        "Beef patty, cheddar, lettuce, tomato, house sauce on brioche.",
      price: 89,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
      category: "burgers",
      rating: 4.5,
      reviews: 234,
    },
    {
      name: "Margarita Pizza",
      description: "Tomato, fresh mozzarella, basil, extra virgin olive oil.",
      price: 129,
      image:
        "https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=800&h=600&fit=crop",
      category: "pizza",
      rating: 4.7,
      reviews: 156,
    },
    {
      name: "Spicy Fried Chicken",
      description: "Crispy fried chicken with house spice blend and pickles.",
      price: 99,
      image:
        "https://images.unsplash.com/photo-1626082927389-6cd097cfd83e?w=800&h=600&fit=crop",
      category: "chicken",
      rating: 4.6,
      reviews: 198,
    },
    {
      name: "Chocolate Cake",
      description: "Rich chocolate sponge, ganache frosting, cocoa nib crunch.",
      price: 59,
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop",
      category: "desserts",
      rating: 4.8,
      reviews: 142,
    },
    {
      name: "Fresh Juice",
      description: "Cold-pressed seasonal fruits, no added sugar.",
      price: 29,
      image:
        "https://images.unsplash.com/photo-1599599810694-f3f465b6ee0d?w=800&h=600&fit=crop",
      category: "drinks",
      rating: 4.4,
      reviews: 88,
    },
    {
      name: "Double Cheeseburger",
      description: "Double beef patties, double cheddar, caramelized onions.",
      price: 119,
      image:
        "https://images.unsplash.com/photo-1571115764595-644a12c7cb72?w=800&h=600&fit=crop",
      category: "burgers",
      rating: 4.6,
      reviews: 210,
    },
  ];

  try {
    console.log("seedFoodItems: Starting to seed", seed.length, "items");
    const promises = seed.map((item, index) => {
      console.log(`seedFoodItems: Adding item ${index + 1}:`, item.name);
      return addFoodItem(item);
    });
    const results = await Promise.all(promises);
    console.log("seedFoodItems: Successfully seeded all items. IDs:", results);
    return results;
  } catch (error) {
    console.error("seedFoodItems: Error seeding items:", error);
    throw error;
  }
};

const mapDocToFoodItem = (docSnap: QueryDocumentSnapshot): FoodItem => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    name: data.name,
    description: data.description,
    price: data.price,
    image: data.image,
    category: data.category,
    rating: data.rating,
    reviews: data.reviews,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  } as FoodItem;
};
