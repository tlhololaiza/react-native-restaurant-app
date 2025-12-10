import { Button } from '@/components/Button';
import { COLORS } from '@/utils/colors';
import { commonStyles, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '@/utils/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: '1',
    name: 'Classic Burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    price: 2500,
    quantity: 2,
  },
  {
    id: '2',
    name: 'Margarita Pizza',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=400&h=300&fit=crop',
    price: 3500,
    quantity: 1,
  },
];

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>(MOCK_CART_ITEMS);

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCheckout = () => {
    router.push('/(modal)/checkout');
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>R{item.price.toLocaleString()}</Text>
      </View>

      <View style={styles.quantityControl}>
        <TouchableOpacity
          onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
          style={styles.quantityButton}
        >
          <MaterialIcons name="remove" size={18} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
          style={styles.quantityButton}
        >
          <MaterialIcons name="add" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => handleRemoveItem(item.id)}
        style={styles.removeButton}
      >
        <MaterialIcons name="delete" size={20} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="shopping-cart" size={80} color={COLORS.gray300} />
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>Add some delicious food!</Text>
      <Button
        title="Start Shopping"
        onPress={() => router.push('/(tabs)/home')}
        fullWidth
        style={styles.emptyButton}
      />
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={commonStyles.container}>
        {renderEmptyCart()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <View style={styles.itemCount}>
          <Text style={styles.itemCountText}>{cartItems.length} items</Text>
        </View>
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
      />

      {/* Clear Cart Button */}
      <TouchableOpacity
        onPress={handleClearCart}
        style={styles.clearButton}
      >
        <MaterialIcons name="delete-sweep" size={20} color={COLORS.error} />
        <Text style={styles.clearButtonText}>Clear Cart</Text>
      </TouchableOpacity>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>R{totalPrice.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>R50</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>R{(totalPrice + 50).toLocaleString()}</Text>
        </View>
      </View>

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <Button
          title="Proceed to Checkout"
          onPress={handleCheckout}
          fullWidth
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  itemCount: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  itemCountText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.white,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.md,
    marginRight: SPACING.md,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  itemPrice: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.primary,
    fontWeight: '700',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    marginRight: SPACING.md,
  },
  quantityButton: {
    padding: 4,
  },
  quantity: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.text,
    marginHorizontal: SPACING.sm,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: SPACING.sm,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderColor: COLORS.error,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
  },
  clearButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.error,
  },
  summary: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    ...SHADOWS.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  summaryLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
  },
  summaryValue: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  totalLabel: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
  },
  totalValue: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    fontWeight: '700',
  },
  checkoutContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
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
    marginBottom: SPACING.xl,
  },
  emptyButton: {
    marginTop: SPACING.xl,
  },
});