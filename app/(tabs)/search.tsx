import { CategoryTabs } from '@/components/CategoryTabs';
import { FoodCard } from '@/components/FoodCard';
import { InputField } from '@/components/InputField';
import { COLORS } from '@/utils/colors';
import { commonStyles, SPACING, TYPOGRAPHY } from '@/utils/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';

const CATEGORIES = [
  { id: '1', name: 'Burgers' },
  { id: '2', name: 'Pizza' },
  { id: '3', name: 'Chicken' },
  { id: '4', name: 'Desserts' },
  { id: '5', name: 'Drinks' },
];

const FOOD_ITEMS = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    name: 'Classic Burger',
    price: 2500,
    rating: 4.5,
    category: '1',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=400&h=300&fit=crop',
    name: 'Margarita Pizza',
    price: 3500,
    rating: 4.7,
    category: '2',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cfd83e?w=400&h=300&fit=crop',
    name: 'Spicy Fried Chicken',
    price: 2800,
    rating: 4.6,
    category: '3',
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    name: 'Chocolate Cake',
    price: 1500,
    rating: 4.8,
    category: '4',
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1599599810694-f3f465b6ee0d?w=400&h=300&fit=crop',
    name: 'Fresh Juice',
    price: 800,
    rating: 4.4,
    category: '5',
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1571115764595-644a12c7cb72?w=400&h=300&fit=crop',
    name: 'Double Cheeseburger',
    price: 3200,
    rating: 4.6,
    category: '1',
  },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  const filteredItems = FOOD_ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFoodPress = (id: string) => {
    router.push({
      pathname: '/(modal)/item-details',
      params: { itemId: id },
    });
  };

  const handleAddToCart = (itemId: string) => {
    // TODO: Add to cart
  };

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      <View style={styles.searchContainer}>
        <InputField
          placeholder="Search for food..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon="search"
        />
      </View>

      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Filter by Category</Text>
        <CategoryTabs
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={(id) =>
            setActiveCategory(activeCategory === id ? '' : id)
          }
        />
      </View>

      {searchQuery && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            Found {filteredItems.length} items
          </Text>
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
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.white,
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
  resultsHeader: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
  },
  resultsText: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.textLight,
  },
  listContent: {
    paddingBottom: SPACING.xxxl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
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