import { Button } from '@/components/Button';
import { InputField } from '@/components/InputField';
import { COLORS } from '@/utils/colors';
import { commonStyles, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '@/utils/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const MOCK_CART_ITEMS: CartItem[] = [
  { id: '1', name: 'Classic Burger', price: 2500, quantity: 2 },
  { id: '2', name: 'Margarita Pizza', price: 3500, quantity: 1 },
];

export default function CheckoutScreen() {
  const [deliveryAddress, setDeliveryAddress] = useState('123 Main St, City');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const subtotal = MOCK_CART_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 500;
  const tax = Math.floor(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Simulate order placement
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push({
        pathname: '/(modal)/order-success',
        params: { orderNumber: '12345678' },
      });
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
            label="Address"
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
              paymentMethod === 'card' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <View
              style={[
                styles.radioButton,
                paymentMethod === 'card' && styles.radioButtonSelected,
              ]}
            >
              {paymentMethod === 'card' && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
            <MaterialIcons name="credit-card" size={20} color={COLORS.primary} />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={styles.paymentMethodName}>Credit/Debit Card</Text>
              <Text style={styles.paymentMethodDescription}>
                **** **** **** 3456
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'wallet' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('wallet')}
          >
            <View
              style={[
                styles.radioButton,
                paymentMethod === 'wallet' && styles.radioButtonSelected,
              ]}
            >
              {paymentMethod === 'wallet' && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
            <MaterialIcons name="account-balance-wallet" size={20} color={COLORS.primary} />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={styles.paymentMethodName}>Mobile Wallet</Text>
              <Text style={styles.paymentMethodDescription}>
                Balance: R5,000
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'cash' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('cash')}
          >
            <View
              style={[
                styles.radioButton,
                paymentMethod === 'cash' && styles.radioButtonSelected,
              ]}
            >
              {paymentMethod === 'cash' && (
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
            {MOCK_CART_ITEMS.map((item) => (
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
              <Text style={styles.summaryValue}>R{subtotal.toLocaleString()}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (5%)</Text>
              <Text style={styles.summaryValue}>R{tax.toLocaleString()}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>R{deliveryFee.toLocaleString()}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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