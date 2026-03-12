import { Button } from "@/components/Button";
import { InputField } from "@/components/InputField";
import { createOrder } from "@/services/orderService";
import { useAuthStore } from "@/utils/authStore";
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
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CheckoutScreen() {
  const { user, userProfile } = useAuthStore();
  const { items, clearCart, getTotal } = useCartStore();
  const [deliveryAddress, setDeliveryAddress] = useState(
    userProfile?.address || "",
  );

  // Keep delivery address in sync with logged-in user's profile
  useEffect(() => {
    if (userProfile?.address) setDeliveryAddress(userProfile.address);
  }, [userProfile]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if user is authenticated
  useFocusEffect(
    useCallback(() => {
      if (!user) {
        Alert.alert(
          "Login Required",
          "Please login or register to place an order",
          [
            { text: "Cancel", onPress: () => router.back(), style: "cancel" },
            { text: "Login", onPress: () => router.push("/(auth)/login") },
          ],
        );
      }
    }, [user]),
  );

  const subtotal = getTotal();
  const deliveryFee = 15;
  const tax = Math.floor(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    if (!user || !userProfile) {
      Alert.alert("Error", "Please login to place an order");
      router.push("/(auth)/login");
      return;
    }

    if (!deliveryAddress || deliveryAddress.trim().length === 0) {
      Alert.alert(
        "Address required",
        "Please enter a delivery address before placing your order.",
      );
      return;
    }

    if (paymentMethod === "card" && !userProfile.cardNumber) {
      Alert.alert(
        "No Card Saved",
        "Please add a payment card in your profile before placing an order.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Edit Profile",
            onPress: () => router.push("/(tabs)/profile"),
          },
        ],
      );
      return;
    }

    setLoading(true);
    try {
      const orderId = await createOrder({
        uid: user.uid,
        userName: userProfile.name,
        userSurname: userProfile.surname,
        userEmail: userProfile.email,
        userPhone: userProfile.phone,
        deliveryAddress: deliveryAddress,
        cardNumber: userProfile.cardNumber,
        items,
        subtotal,
        tax,
        deliveryFee,
        total,
        status: "pending",
      });

      clearCart();

      router.push({
        pathname: "/(modal)/order-success",
        // Pass safe string params to avoid issues with web routing
        params: {
          orderNumber: encodeURIComponent(String(orderId)),
          total: encodeURIComponent(String(total)),
        },
      });
    } catch {
      Alert.alert("Error", "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <InputField
            label="Address *"
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            icon="location-on"
          />
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === "card" && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod("card")}
          >
            <View
              style={[
                styles.radioButton,
                paymentMethod === "card" && styles.radioButtonSelected,
              ]}
            >
              {paymentMethod === "card" && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
            <MaterialIcons
              name="credit-card"
              size={20}
              color={COLORS.primary}
            />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={styles.paymentMethodName}>Credit/Debit Card</Text>
              <Text style={styles.paymentMethodDescription}>
                {userProfile?.cardNumber
                  ? userProfile.cardNumber
                      .replace(/\s+/g, "")
                      .replace(/.(?=.{4})/g, "*")
                      .match(/.{1,4}/g)
                      ?.join(" ")
                  : "No card saved"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === "wallet" && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod("wallet")}
          >
            <View
              style={[
                styles.radioButton,
                paymentMethod === "wallet" && styles.radioButtonSelected,
              ]}
            >
              {paymentMethod === "wallet" && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
            <MaterialIcons
              name="account-balance-wallet"
              size={20}
              color={COLORS.primary}
            />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={styles.paymentMethodName}>Mobile Wallet</Text>
              <Text style={styles.paymentMethodDescription}>Balance: —</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === "cash" && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod("cash")}
          >
            <View
              style={[
                styles.radioButton,
                paymentMethod === "cash" && styles.radioButtonSelected,
              ]}
            >
              {paymentMethod === "cash" && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
            <MaterialIcons name="local-atm" size={20} color={COLORS.primary} />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={styles.paymentMethodName}>Cash on Delivery</Text>
              <Text style={styles.paymentMethodDescription}>
                Pay when food arrives
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Special Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <InputField
            placeholder="Add notes for the driver (optional)"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.summaryCard}>
            {items.map((item) => (
              <View key={item.id} style={styles.summaryItem}>
                <Text style={styles.summaryItemName}>
                  {item.name} x{item.quantity}
                </Text>
                <Text style={styles.summaryItemPrice}>
                  R{(item.price * item.quantity).toLocaleString()}
                </Text>
              </View>
            ))}

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                R{subtotal.toLocaleString()}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (5%)</Text>
              <Text style={styles.summaryValue}>R{tax.toLocaleString()}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>
                R{deliveryFee.toLocaleString()}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>R{total.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.bottomSection}>
        <Button
          title="Place Order"
          onPress={handlePlaceOrder}
          loading={loading}
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
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  section: {
    marginBottom: SPACING.xxxl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderColor: COLORS.border,
    borderWidth: 1,
    ...SHADOWS.sm,
  },
  paymentOptionSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.full,
    borderColor: COLORS.gray400,
    borderWidth: 2,
    marginRight: SPACING.md,
    ...commonStyles.centered,
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
  },
  paymentMethodName: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.text,
  },
  paymentMethodDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  summaryItemName: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flex: 1,
  },
  summaryItemPrice: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  totalLabel: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
  },
  totalValue: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    fontWeight: "700",
  },
  bottomSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
  },
});
