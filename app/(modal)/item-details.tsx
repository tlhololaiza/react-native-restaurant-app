import { Button } from '@/components/Button';
import { COLORS } from '@/utils/colors';
import { commonStyles, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '@/utils/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { height } = Dimensions.get('window');

// Mock item data
const FOOD_DATA: Record<
  string,
  {
    id: string;
    image: string;
    name: string;
    price: number;
    description: string;
    rating: number;
    reviews: number;
  }
> = {
  '1': {
    id: '1',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=500&fit=crop',
    name: 'Classic Burger',
    price: 2500,
    description:
      'A delicious classic burger with fresh beef, crispy lettuce, tomato, and our signature sauce on a toasted bun.',
    rating: 4.5,
    reviews: 234,
  },
  '2': {
    id: '2',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=400&h=500&fit=crop',
    name: 'Margarita Pizza',
    price: 3500,
    description:
      'Traditional Italian pizza with fresh mozzarella, basil, and tomato sauce on a thin crispy crust.',
    rating: 4.7,
    reviews: 156,
  },
};

export default function ItemDetailsScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const item = itemId ? FOOD_DATA[itemId] : FOOD_DATA['1'];

  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const EXTRAS = [
    { id: '1', name: 'Extra Cheese', price: 200 },
    { id: '2', name: 'Bacon', price: 300 },
    { id: '3', name: 'Mushrooms', price: 150 },
    { id: '4', name: 'Onions', price: 100 },
  ];

  const SIDES = [
    { id: 's1', name: 'French Fries', price: 500 },
    { id: 's2', name: 'Coleslaw', price: 300 },
    { id: 's3', name: 'Jalapeño Poppers', price: 400 },
  ];

  const toggleExtra = (extraId: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]
    );
  };

  const extrasTotal = selectedExtras.reduce((sum, id) => {
    const extra = [...EXTRAS, ...SIDES].find((e) => e.id === id);
    return sum + (extra?.price || 0);
  }, 0);

  const totalPrice = (item.price + extrasTotal) * quantity;

  const handleAddToCart = () => {
    // TODO: Add to cart logic
    router.back();
  };

  const handleEditExtras = () => {
    router.push({
      pathname: '/(modal)/edit-extras',
      params: { itemId: item.id },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <TouchableOpacity>
          <MaterialIcons name="favorite-border" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Large Food Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.ratingBadge}>
            <MaterialIcons name="star" size={18} color={COLORS.white} />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewsText}>({item.reviews} reviews)</Text>
          </View>
        </View>

        {/* Food Info */}
        <View style={styles.infoSection}>
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>

          {/* Price Display */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>₦{totalPrice.toLocaleString()}</Text>
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityControl}>
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                style={styles.quantityButton}
              >
                <MaterialIcons name="remove" size={20} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                style={styles.quantityButton}
              >
                <MaterialIcons name="add" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Extras Section */}
          <View style={styles.optionsSection}>
            <Text style={styles.sectionTitle}>Add Extras</Text>
            {EXTRAS.map((extra) => (
              <TouchableOpacity
                key={extra.id}
                style={styles.optionItem}
                onPress={() => toggleExtra(extra.id)}
              >
                <View style={styles.optionCheckbox}>
                  {selectedExtras.includes(extra.id) && (
                    <MaterialIcons name="check" size={16} color={COLORS.white} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionName}>{extra.name}</Text>
                </View>
                <Text style={styles.optionPrice}>+₦{extra.price}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sides Section */}
          <View style={styles.optionsSection}>
            <Text style={styles.sectionTitle}>Choose a Side</Text>
            {SIDES.map((side) => (
              <TouchableOpacity
                key={side.id}
                style={styles.optionItem}
                onPress={() => toggleExtra(side.id)}
              >
                <View style={styles.optionCheckbox}>
                  {selectedExtras.includes(side.id) && (
                    <MaterialIcons name="check" size={16} color={COLORS.white} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionName}>{side.name}</Text>
                </View>
                <Text style={styles.optionPrice}>+₦{side.price}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Suggested Items */}
          <View style={styles.suggestedSection}>
            <Text style={styles.sectionTitle}>Also Try</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.suggestedScroll}
            >
              <TouchableOpacity style={styles.suggestedCard}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=300&h=300&fit=crop',
                  }}
                  style={styles.suggestedImage}
                />
                <Text style={styles.suggestedName}>Pizza</Text>
                <Text style={styles.suggestedPrice}>₦3500</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.suggestedCard}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1626082927389-6cd097cfd83e?w=300&h=300&fit=crop',
                  }}
                  style={styles.suggestedImage}
                />
                <Text style={styles.suggestedName}>Chicken</Text>
                <Text style={styles.suggestedPrice}>₦2800</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.suggestedCard}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop',
                  }}
                  style={styles.suggestedImage}
                />
                <Text style={styles.suggestedName}>Dessert</Text>
                <Text style={styles.suggestedPrice}>₦1500</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.bottomSection}>
        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          fullWidth
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  headerTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
  },
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },
  imageContainer: {
    width: '100%',
    height: height * 0.35,
    backgroundColor: COLORS.white,
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: COLORS.gray900,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.white,
  },
  reviewsText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
  },
  infoSection: {
    paddingHorizontal: SPACING.lg,
  },
  nameRow: {
    marginBottom: SPACING.lg,
  },
  foodName: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    lineHeight: 24,
  },
  priceContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.textLight,
  },
  price: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
    fontWeight: '700',
  },
  quantitySection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  quantityButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  quantityText: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
    minWidth: 40,
    textAlign: 'center',
  },
  optionsSection: {
    marginBottom: SPACING.xl,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  optionCheckbox: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    marginRight: SPACING.md,
    ...commonStyles.centered,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  optionName: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.text,
  },
  optionPrice: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.primary,
    fontWeight: '700',
  },
  suggestedSection: {
    marginBottom: SPACING.xl,
  },
  suggestedScroll: {
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  suggestedCard: {
    marginRight: SPACING.lg,
    alignItems: 'center',
  },
  suggestedImage: {
    width: 120,
    height: 120,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  suggestedName: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.text,
  },
  suggestedPrice: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.primary,
    fontWeight: '700',
  },
  bottomSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
  },
});