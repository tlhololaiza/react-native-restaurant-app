import { CategoriesSection } from "@/components/CategoriesSection";
import { FoodCard } from "@/components/FoodCard";
import { SearchBar } from "@/components/SearchBar";
import { getFoodItems } from "@/services/foodService";
import { CATEGORIES } from "@/utils/categories";
import { COLORS } from "@/utils/colors";
import { initializeFirestoreData } from "@/utils/seedService";
import { commonStyles, SPACING, TYPOGRAPHY } from "@/utils/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";

// Categories mapping (imported from utils/categories)

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [foodItems, setFoodItems] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await initializeFirestoreData();
        const items = await getFoodItems();
        console.log("SearchScreen: Loaded items:", items.length);
        setFoodItems(items);
      } catch (error) {
        console.error("SearchScreen: Error loading food items:", error);
      }
    };

    loadData();
  }, []);

  const filteredItems = foodItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFoodPress = (id: string) => {
    const item = foodItems.find((i) => i.id === id);
    if (!item) return;
    router.push({
      pathname: "/(modal)/item-details",
      params: { item: JSON.stringify(item) },
    });
  };

  const handleAddToCart = (itemId: string) => {
    // TODO: Add to cart
  };

  const renderHeader = () => (
    <View>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔍 Discover Meals</Text>
        <Text style={styles.headerSubtitle}>Find your favorite dishes</Text>
      </View>

      {/* Search Container */}
      <SearchBar
        placeholder="Search for food..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Categories Section */}
      <CategoriesSection
        title="Filter by Category"
        icon="filter-alt"
        iconColor={COLORS.primary}
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={(id) =>
          setActiveCategory(activeCategory === id ? "" : id)
        }
      />

      {/* Results Header */}
      {(searchQuery || activeCategory) && (
        <View style={styles.resultsHeader}>
          <View style={styles.resultsContent}>
            <MaterialIcons name="done-all" size={18} color={COLORS.primary} />
            <Text style={styles.resultsText}>
              Found{" "}
              <Text style={styles.resultsBold}>{filteredItems.length}</Text>{" "}
              delicious items
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="search" size={64} color={COLORS.gray300} />
      <Text style={styles.emptyTitle}>No results found</Text>
      <Text style={styles.emptySubtitle}>Try searching for something else</Text>
    </View>
  );

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
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          searchQuery || activeCategory ? renderEmptyState() : null
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.white,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: SPACING.xs,
  },
  categoriesSection: {
    backgroundColor: COLORS.white,
    paddingBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  resultsHeader: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
  },
  resultsContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  resultsText: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
  },
  resultsBold: {
    fontWeight: "700",
    color: COLORS.primary,
  },
  listContent: {
    paddingBottom: SPACING.xxxl,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  foodCardWrapper: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    ...commonStyles.centered,
    paddingHorizontal: SPACING.lg,
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
  },
});
