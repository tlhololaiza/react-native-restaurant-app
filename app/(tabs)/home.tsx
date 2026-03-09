import { CategoriesSection } from "@/components/CategoriesSection";
import { FoodCard } from "@/components/FoodCard";
import { getFoodItems } from "@/services/foodService";
import { useAuthStore } from "@/utils/authStore";
import { useCartStore } from "@/utils/cartStore";
import { CATEGORIES } from "@/utils/categories";
import { COLORS } from "@/utils/colors";
import { initializeFirestoreData } from "@/utils/seedService";
import { commonStyles, RADIUS, SPACING, TYPOGRAPHY } from "@/utils/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Categories mapping (imported from utils/categories)

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("burgers");
  const { user, userProfile } = useAuthStore();
  const userName = userProfile?.name
    ? `${userProfile.name}${userProfile.surname ? ` ${userProfile.surname}` : ""}`
    : (user?.displayName ?? "Guest");
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem, getItemCount } = useCartStore();
  const cartCount = getItemCount();

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("HomeScreen: Starting data load...");
        setLoading(true);
        setError(null);

        await initializeFirestoreData();
        console.log("HomeScreen: Fetching food items...");
        const items = await getFoodItems();
        console.log("HomeScreen: Fetched items:", items.length, items);

        if (items && items.length > 0) {
          setFoodItems(items);
          console.log("HomeScreen: Items set successfully");
        } else {
          setError("No food items available");
        }
      } catch (error) {
        console.error("HomeScreen: Error loading food items:", error);
        setError("Failed to load menu items");
      } finally {
        setLoading(false);
        console.log("HomeScreen: Loading complete");
      }
    };

    loadData();
  }, []);

  const filteredItems = foodItems.filter(
    (item) =>
      item.category === activeCategory &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleFoodPress = (id: string) => {
    const item = foodItems.find((i) => i.id === id);
    if (!item) return;
    router.push({
      pathname: "/(modal)/item-details",
      // Encode the item JSON so it survives URL/query transport (web safe)
      params: { item: encodeURIComponent(JSON.stringify(item)) },
    });
  };

  const handleAddToCart = (itemId: string) => {
    const item = foodItems.find((i) => i.id === itemId);
    if (item) {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
      });
    }
  };

  const renderHeader = () => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good Morning";
      if (hour < 18) return "Good Afternoon";
      return "Good Evening";
    };

    return (
      <View>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <View>
            <Text style={styles.greeting}>
              {getGreeting()}, {userName}!
            </Text>
            <Text style={styles.location}>
              <MaterialIcons
                name="location-on"
                size={14}
                color={COLORS.textLight}
              />
              {" 123 Main St, City"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.cartIcon}
            onPress={() => router.push("/(tabs)/cart")}
          >
            <MaterialIcons
              name="shopping-cart"
              size={24}
              color={COLORS.white}
            />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <CategoriesSection
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <Text style={styles.resultsTitle}>Popular Items</Text>
      </View>
    );
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.emptyText}>Loading delicious items...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="error-outline" size={64} color={COLORS.error} />
          <Text style={styles.emptyTitle}>Oops!</Text>
          <Text style={styles.emptySubtitle}>{error}</Text>
          <Text style={styles.emptyHint}>
            Using local menu data. Firestore might be blocked by ad blocker.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="restaurant" size={64} color={COLORS.gray300} />
        <Text style={styles.emptyTitle}>No items found</Text>
        <Text style={styles.emptySubtitle}>
          {searchQuery
            ? "Try searching for something else"
            : "No items in this category yet"}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <FlatList
        data={filteredItems}
        renderItem={({ item }) => (
          <View style={styles.foodCardWrapper}>
            <FoodCard
              id={item.id}
              image={item.image}
              name={item.name}
              price={item.price}
              rating={item.rating}
              onPress={() => handleFoodPress(item.id)}
              onCartPress={() => handleAddToCart(item.id)}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={
          filteredItems.length > 0 ? styles.columnWrapper : undefined
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingTop: 0,
  },
  greeting: {
    ...TYPOGRAPHY.h4,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  location: {
    ...TYPOGRAPHY.caption,
    color: "rgba(255, 255, 255, 0.8)",
  },
  cartIcon: {
    position: "relative",
    padding: SPACING.md,
  },
  cartBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: COLORS.error,
    borderRadius: RADIUS.full,
    width: 24,
    height: 24,
    ...commonStyles.centered,
  },
  cartBadgeText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.white,
  },
  categoriesSection: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  resultsTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
    backgroundColor: COLORS.white,
    paddingTop: SPACING.md,
  },
  listContent: {
    paddingBottom: SPACING.xxxl,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
  },
  foodCardWrapper: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.lg,
    minHeight: 300,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    marginTop: SPACING.md,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    textAlign: "center",
  },
  emptyHint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.gray400,
    textAlign: "center",
    marginTop: SPACING.md,
    fontStyle: "italic",
  },
});
