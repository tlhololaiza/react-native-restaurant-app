import { getFoodItems, seedFoodItems } from "@/services/foodService";

export const initializeFirestoreData = async () => {
  try {
    // Check if data already exists
    const existingItems = await getFoodItems();

    if (existingItems.length === 0) {
      console.log("No food items found. Seeding database...");
      try {
        await seedFoodItems();
        console.log("Firestore data seeded successfully");
      } catch (seedError) {
        console.warn(
          "Could not seed Firestore (might be blocked), using mock data:",
          seedError,
        );
      }
    } else {
      console.log(`Found ${existingItems.length} existing food items`);
    }
  } catch (error) {
    console.warn(
      "Error initializing Firestore data, will use mock data fallback:",
      error,
    );
    // Don't throw - let the app continue with mock data
  }
};
