import { Button } from "@/components/Button";
import { useCartStore } from "@/utils/cartStore";
import { COLORS } from "@/utils/colors";
import {
  commonStyles,
  RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "@/utils/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CartScreen() {
  const {
    items: cartItems,
    updateQuantity,
    removeItem,
    clearCart,
    getTotal,
  } = useCartStore();

  const totalPrice = getTotal();

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, quantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleCheckout = () => {
    router.push("/(modal)/checkout");
  };

  const renderCartItem = ({ item }: { item: (typeof cartItems)[0] }) => {
    const itemTotal =
      item.price +
      (item.extras?.reduce((sum, extra) => sum + extra.price, 0) || 0);

    return (
      <View style={styles.cartItem}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />

        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          {item.extras && item.extras.length > 0 && (
            <Text style={styles.itemExtras}>
              {item.extras.map((e) => e.name).join(", ")}
            </Text>
          )}
          {item.sides && (
            <Text style={styles.itemExtras}>Side: {item.sides}</Text>
          )}
          {item.drink && (
            <Text style={styles.itemExtras}>Drink: {item.drink}</Text>
          )}
          <Text style={styles.itemPrice}>R{itemTotal.toLocaleString()}</Text>
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

        {/* Edit extras */}
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(modal)/edit-extras",
              params: { itemId: item.id },
            })
          }
          style={styles.removeButton}
        >
          <MaterialIcons name="edit" size={20} color={COLORS.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleRemoveItem(item.id)}
          style={styles.removeButton}
        >
          <MaterialIcons name="delete" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="shopping-cart" size={80} color={COLORS.gray300} />
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>Add some delicious food!</Text>
      <Button
        title="Start Shopping"
        onPress={() => router.push("/(tabs)/home")}
        fullWidth
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
        style={{ flex: 1 }}
      />

      {/* Clear Cart Button */}
      <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
        <MaterialIcons name="delete-sweep" size={20} color={COLORS.error} />
        <Text style={styles.clearButtonText}>Clear Cart</Text>
      </TouchableOpacity>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>
            R{totalPrice.toLocaleString()}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>R15</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            R{(totalPrice + 15).toLocaleString()}
          </Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    flexDirection: "row",
    alignItems: "center",
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
  itemExtras: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  itemPrice: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.primary,
    fontWeight: "700",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
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
    textAlign: "center",
  },
  removeButton: {
    padding: SPACING.sm,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    flexDirection: "row",
    justifyContent: "space-between",
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
    fontWeight: "700",
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
