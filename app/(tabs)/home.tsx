import { CategoryTabs } from '@/components/CategoryTabs';
import { FoodCard } from '@/components/FoodCard';
import { SearchBar } from '@/components/SearchBar';
import { COLORS } from '@/utils/colors';
import { commonStyles, RADIUS, SPACING, TYPOGRAPHY } from '@/utils/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

// Mock data
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

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('1');
  const [cartCount, setCartCount] = useState(0);

  const filteredItems = FOOD_ITEMS.filter(
    (item) =>
      item.category === activeCategory &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFoodPress = (id: string) => {
    router.push({
      pathname: '/(modal)/item-details',
      params: { itemId: id },
    });
  };

  const handleAddToCart = (itemId: string) => {
    setCartCount((prev) => prev + 1);
    // TODO: Add item to cart context/state
  };

  const renderHeader = () => (
    <View>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.greeting}>Good Morning!</Text>
          <Text style={styles.location}>
            <MaterialIcons name="location-on" size={14} color={COLORS.textLight} />
            {' 123 Main St, City'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.cartIcon}
          onPress={() => router.push('/(tabs)/cart')}
        >
          <MaterialIcons name="shopping-cart" size={24} color={COLORS.white} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search burgers, pizza..."
      />

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <CategoryTabs
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </View>

      <Text style={styles.resultsTitle}>Popular Items</Text>
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
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cartIcon: {
    position: 'relative',
    padding: SPACING.md,
  },
  cartBadge: {
    position: 'absolute',
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
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
  foodCardWrapper: {
    flex: 1,
  },
});
