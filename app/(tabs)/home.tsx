// categories removed from home — show all foods
import { FoodCard } from "@/components/FoodCard";
import { getFoodItems } from "@/services/foodService";
import { useAuthStore } from "@/utils/authStore";
import { useCartStore } from "@/utils/cartStore";
import { COLORS } from "@/utils/colors";
import { initializeFirestoreData } from "@/utils/seedService";
import { commonStyles, RADIUS, SPACING, TYPOGRAPHY } from "@/utils/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

// Categories mapping (imported from utils/categories)

export default function HomeScreen() {
  // removed search and category filter; show all foods
  const { user, userProfile } = useAuthStore();
  const userName = userProfile?.name
    ? `${userProfile.name}${userProfile.surname ? ` ${userProfile.surname}` : ""}`
    : (user?.displayName ?? "Guest");
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories] = useState<string[]>([
    "All",
    "Starters",
    "Burgers",
    "Mains",
    "Desserts",
    "Beverages",
    "Alcoholic Drinks",
  ]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
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

  const filteredItems = foodItems;
  const visibleItems =
    activeCategory === "All"
      ? filteredItems
      : filteredItems.filter((i) => i.category === activeCategory);

  const popularItems = filteredItems.filter((i) => (i.rating ?? 0) > 4.6);

  const handleFoodPress = (id: string) => {
    const item = foodItems.find((i) => i.id === id);
    if (!item) return;
    router.push({
      pathname: "/(modal)/item-details",
      params: { item: JSON.stringify(item) },
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
      if (Platform.OS === "android") {
        ToastAndroid.show("Added to cart", ToastAndroid.SHORT);
      } else {
        Alert.alert("Added to cart", `${item.name} was added to your cart.`);
      }
    }
  };

  const renderHeader = () => {
    const heroImage = {
      uri: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=0c3f8fa5f21f9f1f3dbdfd56a0e0c0d8",
    };

    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good Morning";
      if (hour < 18) return "Good Afternoon";
      return "Good Evening";
    };

    return (
      <View>
        {/* NAVBAR */}
        <View style={styles.navbar}>
          <View style={styles.brandRow}>
            <Image
              source={require("../../assets/logo/logo.jpg")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.brand}>FoodHub</Text>
          </View>
          <View style={styles.navItems}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push("/(tabs)/cart")}
            >
              <MaterialIcons
                name="shopping-cart"
                size={20}
                color={COLORS.text}
              />
              {cartCount > 0 && (
                <View style={styles.cartBadgeSmall}>
                  <Text style={styles.cartBadgeTextSmall}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* HERO */}
        <ImageBackground
          source={heroImage}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              {getGreeting()}, {userName}! Welcome to FoodHub
            </Text>
            <Text style={styles.heroSubtitle} numberOfLines={2}>
              Where we serve happiness on a plate.
            </Text>
            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => setActiveCategory("All")}
            >
              <Text
                style={styles.heroButtonText}
                onPress={() => router.push("/(tabs)/search")}
              >
                View Menu
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <LinearGradient
          colors={["transparent", COLORS.white]}
          style={styles.transitionGradient}
        />
        <View style={{ height: SPACING.md }} />
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
        <Text style={styles.emptySubtitle}>No items available</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      {renderHeader()}

      <View style={styles.popularSectionMain}>
        <Text style={styles.popularTitle}>Our most popular</Text>
        <FlatList
          data={popularItems}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.popularListMain}
          renderItem={({ item }) => (
            <View style={styles.popularItemMain}>
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
          ListEmptyComponent={renderEmptyState}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  brand: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 36,
    height: 36,
    marginRight: SPACING.sm,
    borderRadius: RADIUS.full,
    overflow: "hidden",
  },
  navItems: {
    flexDirection: "row",
    alignItems: "center",
  },
  navMenuButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    marginRight: SPACING.sm,
  },
  navMenuText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.white,
  },
  iconButton: {
    marginLeft: SPACING.sm,
    padding: SPACING.xs,
    position: "relative",
  },
  cartBadgeSmall: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: COLORS.primary,
    width: 18,
    height: 18,
    borderRadius: RADIUS.full,
    ...commonStyles.centered,
  },
  cartBadgeTextSmall: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.white,
    fontSize: 10,
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
  hero: {
    height: 320,
    justifyContent: "center",
  },
  heroImage: {
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.lg,
    overflow: "hidden",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.lg,
  },
  heroContent: {
    position: "absolute",
    left: SPACING.lg * 1.2,
    right: SPACING.lg * 1.2,
    top: 40,
    alignItems: "flex-start",
  },
  heroTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  heroSubtitle: {
    ...TYPOGRAPHY.body,
    color: "rgba(255,255,255,0.9)",
    marginBottom: SPACING.md,
  },
  heroButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.full,
  },
  heroButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.white,
  },
  transitionGradient: {
    height: 36,
    marginHorizontal: SPACING.lg,
    marginTop: -12,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
  },
  popularSectionMain: {
    backgroundColor: COLORS.white,
    paddingTop: SPACING.sm,
  },
  popularTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  popularListMain: {
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.lg / 2,
  },
  popularItemMain: {
    width: 180,
    marginRight: SPACING.md,
  },
  menuFilters: {
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.white,
    paddingBottom: SPACING.sm,
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: SPACING.sm,
  },
  pill: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    marginRight: SPACING.sm,
  },
  pillActive: {
    backgroundColor: COLORS.primary,
  },
  pillInactive: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  pillText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },
  pillTextActive: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.white,
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
