import { Button } from "@/components/Button";
import { getUserOrders, Order } from "@/services/orderService";
import { useAuthStore } from "@/utils/authStore";
import { useCartStore } from "@/utils/cartStore";
import { COLORS } from "@/utils/colors";
import { commonStyles, RADIUS, SPACING, TYPOGRAPHY } from "@/utils/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function OrderDetailsModal() {
  const { id: orderId } = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user || !orderId) return;
      const orders = await getUserOrders(user.uid);
      const found = orders.find((o) => o.id === orderId) || null;
      setOrder(found);
    };
    load();
  }, [user, orderId]);

  const handleReorder = () => {
    if (!order) return;
    order.items.forEach((i) => {
      addItem({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      });
    });
    router.push("/(tabs)/cart");
  };

  if (!order) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <Text style={{ padding: SPACING.lg }}>Order not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Order #{order.id?.slice(-6)}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Status</Text>
          <Text style={styles.metaValue}>{order.status}</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Placed</Text>
          <Text style={styles.metaValue}>
            {new Date(order.createdAt).toLocaleString()}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery</Text>
          <Text style={styles.sectionText}>{order.deliveryAddress}</Text>
          <Text style={styles.sectionText}>{order.userPhone}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          {order.items.map((it) => (
            <View key={it.id} style={styles.itemRow}>
              <Image source={{ uri: it.image }} style={styles.itemImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{it.name}</Text>
                <Text style={styles.itemQty}>x{it.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                R{(it.price * it.quantity).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              R{order.subtotal.toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>
              R{order.tax.toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={styles.summaryValue}>
              R{order.deliveryFee.toLocaleString()}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              R{order.total.toLocaleString()}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <Button title="Re-order" onPress={handleReorder} fullWidth size="lg" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  title: { ...TYPOGRAPHY.h3, color: COLORS.text },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  metaLabel: { ...TYPOGRAPHY.caption, color: COLORS.textLight },
  metaValue: { ...TYPOGRAPHY.bodyBold, color: COLORS.text },
  section: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  sectionText: { ...TYPOGRAPHY.body, color: COLORS.textLight },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.md,
    marginRight: SPACING.md,
  },
  itemName: { ...TYPOGRAPHY.bodyBold, color: COLORS.text },
  itemQty: { ...TYPOGRAPHY.caption, color: COLORS.textLight },
  itemPrice: { ...TYPOGRAPHY.bodyBold, color: COLORS.text },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  summaryLabel: { ...TYPOGRAPHY.body, color: COLORS.textLight },
  summaryValue: { ...TYPOGRAPHY.bodyBold, color: COLORS.text },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  totalLabel: { ...TYPOGRAPHY.h4, color: COLORS.text },
  totalValue: { ...TYPOGRAPHY.h4, color: COLORS.primary, fontWeight: "700" },
  bottomSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
  },
});
