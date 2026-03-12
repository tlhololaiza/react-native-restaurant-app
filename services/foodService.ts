import { _storageKeys } from "@/services/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    name: "Double Cheeseburger",
    description: "Double beef patties, double cheddar, caramelized onions.",
    price: 119,
    image:
      "https://media.istockphoto.com/id/182214725/photo/double-cheeseburger-with-a-cola.jpg?s=1024x1024&w=is&k=20&c=Kh7mL5k1_zylQBNOKxVdOyxRGKDEW0ubB1ns47W18rY=",
    category: "burgers",
    rating: 4.6,
    reviews: 210,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "3",
    name: "Veggie Burger",
    description: "Grilled plant patty, avocado, lettuce, tomato, vegan aioli.",
    price: 79,
    image:
      "https://media.istockphoto.com/id/2210370045/photo/vegan-burger-plant-based-meat-patty-fresh-tomato-lettuce-toasted-brioche-bun-for-hearty.jpg?s=1024x1024&w=is&k=20&c=d6WEM1kDSJmr1uK5MK-JIz-H8XwR7hyFocmz7nXp3gw=",
    category: "burgers",
    rating: 4.3,
    reviews: 102,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "4",
    name: "Margherita Pizza",
    description: "Tomato, fresh mozzarella, basil, extra virgin olive oil.",
    price: 129,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "pizza",
    rating: 4.7,
    reviews: 156,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "5",
    name: "Pepperoni Pizza",
    description: "Crispy crust, tomato sauce, loads of pepperoni.",
    price: 149,
    image:
      "https://plus.unsplash.com/premium_photo-1667682942148-a0c98d1d70db?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "pizza",
    rating: 4.6,
    reviews: 198,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "6",
    name: "BBQ Chicken",
    description: "Smoky BBQ, grilled chicken, red onions, cilantro.",
    price: 139,
    image:
      "https://media.istockphoto.com/id/1498497473/photo/barbecued-chicken.jpg?s=1024x1024&w=is&k=20&c=A819qGcpQU1G3sxi_Ct8KyZWmJpFxrS-HRjPOw4Kfgw=",
    category: "mains",
    rating: 4.5,
    reviews: 89,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "7",
    name: "Spicy Fried Chicken",
    description: "Crispy fried chicken with house spice blend and pickles.",
    price: 99,
    image:
      "https://plus.unsplash.com/premium_photo-1661419883163-bb4df1c10109?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "chicken",
    rating: 4.6,
    reviews: 198,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "8",
    name: "Grilled Chicken Salad",
    description: "Mixed greens, grilled chicken, cherry tomatoes, vinaigrette.",
    price: 89,
    image:
      "https://plus.unsplash.com/premium_photo-1669742928112-19364a33b530?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "chicken",
    rating: 4.4,
    reviews: 64,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "9",
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
    id: "10",
    name: "Cheesecake",
    description: "Creamy classic cheesecake with berry compote.",
    price: 65,
    image:
      "https://images.unsplash.com/photo-1621955511667-e2c316e4575d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "desserts",
    rating: 4.7,
    reviews: 98,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "11",
    name: "Fresh Juice",
    description: "Cold-pressed seasonal fruits, no added sugar.",
    price: 29,
    image:
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "drinks",
    rating: 4.4,
    reviews: 88,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "12",
    name: "Oreo Shake",
    description: "Creamy milkshake loaded with Oreo chunks.",
    price: 39,
    image:
      "https://images.unsplash.com/photo-1638176066390-d1a2b56cc99c?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "drinks",
    rating: 4.5,
    reviews: 120,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "13",
    name: "Large Fries",
    description: "Crispy golden fries seasoned to perfection.",
    price: 29,
    image:
      "https://images.unsplash.com/photo-1707773726979-4b87cd1c838a?q=80&w=1066&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "sides",
    rating: 4.3,
    reviews: 76,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "14",
    name: "Seafood Platter",
    description: "Assorted seafood served with lemon and herbs.",
    price: 199,
    image:
      "https://plus.unsplash.com/premium_photo-1707581578989-ca678b83ecc5?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "mains",
    rating: 4.6,
    reviews: 45,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "15",
    name: "Strawberry Shake",
    description: "Fresh strawberry shake with whipped cream.",
    price: 39,
    image:
      "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "drinks",
    rating: 4.2,
    reviews: 54,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export const getFoodItems = async (): Promise<FoodItem[]> => {
  try {
    const raw = await AsyncStorage.getItem(_storageKeys.KEY_FOODS);
    if (!raw) return MOCK_FOOD_ITEMS;
    const items = JSON.parse(raw) as FoodItem[];
    if (!items || items.length === 0) return MOCK_FOOD_ITEMS;
    return items;
  } catch (error) {
    console.error(
      "getFoodItems: Error reading storage, using mock data:",
      error,
    );
    return MOCK_FOOD_ITEMS;
  }
};

export const addFoodItem = async (
  item: Omit<FoodItem, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
  const key = _storageKeys.KEY_FOODS;
  const items = await (async () => {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? (JSON.parse(raw) as FoodItem[]) : [];
    } catch {
      return [] as FoodItem[];
    }
  })();

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const now = Date.now();
  const newItem: FoodItem = {
    id,
    ...item,
    createdAt: now,
    updatedAt: now,
  };
  items.push(newItem);
  await AsyncStorage.setItem(key, JSON.stringify(items));
  return id;
};

export const seedFoodItems = async () => {
  const seed: Omit<FoodItem, "id" | "createdAt" | "updatedAt">[] = [
    // reuse a subset of MOCK_FOOD_ITEMS for seeding
    ...MOCK_FOOD_ITEMS.map(
      ({ name, description, price, image, category, rating, reviews }) => ({
        name,
        description,
        price,
        image,
        category,
        rating,
        reviews,
      }),
    ),
  ];

  try {
    const key = _storageKeys.KEY_FOODS;
    const existing = await AsyncStorage.getItem(key);
    if (existing) {
      const parsed = JSON.parse(existing) as FoodItem[];
      if (parsed.length > 0) return parsed.map((i) => i.id);
    }

    const items: FoodItem[] = seed.map((item) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      ...item,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }));
    await AsyncStorage.setItem(key, JSON.stringify(items));
    return items.map((i) => i.id);
  } catch (error) {
    console.error("seedFoodItems: Error seeding items:", error);
    throw error;
  }
};

const mapDocToFoodItem = (_: QueryDocumentSnapshot): FoodItem => {
  // No-op compatibility shim; not used with AsyncStorage backend.
  throw new Error("mapDocToFoodItem is not supported in AsyncStorage mode");
};
