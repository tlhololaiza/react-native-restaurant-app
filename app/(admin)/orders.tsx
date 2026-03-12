import {
    getAllOrders,
    Order,
    updateOrderStatus,
} from "@/services/orderService";
import { COLORS } from "@/utils/colors";
import { RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from "@/utils/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const ALL_STATUSES: Order["status"][] = [
  "pending",
  "confirmed",
  "preparing",
  "delivering",
  "delivered",
  "cancelled",
];

const STATUS_COLORS: Record<string, string> = {
  pending: COLORS.warning,
  confirmed: COLORS.info,
  preparing: "#8B5CF6",
  delivering: "#F97316",
  delivered: COLORS.success,
  cancelled: COLORS.error,
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchOrders = async () => {
    try {
      const list = await getAllOrders();
      setOrders(list);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleStatusChange = (order: Order) => {
    Alert.alert(
      "Update Order Status",
      `Order #${order.id?.slice(-6)}\nCurrent status: ${order.status}`,
      [
        { text: "Cancel", style: "cancel" },
        ...ALL_STATUSES.filter((s) => s !== order.status).map((status) => ({
          text: status.charAt(0).toUpperCase() + status.slice(1),
          onPress: async () => {
            try {
              await updateOrderStatus(order.id!, status);
              setOrders((prev) =>
                prev.map((o) => (o.id === order.id ? { ...o, status } : o)),
              );
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to update status");
            }
          },
        })),
      ],
    );
  };

  const filtered =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders Management</Text>
        <Text style={styles.subtitle}>{orders.length} total</Text>
      </View>

      {/* Filter Pills */}
      <FlatList
        horizontal
        data={["all", ...ALL_STATUSES]}
        keyExtractor={(s) => s}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
        renderItem={({ item: s }) => (
          <TouchableOpacity
            style={[
              styles.pill,
              statusFilter === s ? styles.pillActive : styles.pillInactive,
            ]}
            onPress={() => setStatusFilter(s)}
          >
            <Text
              style={
                statusFilter === s ? styles.pillTextActive : styles.pillText
              }
            >
              {s === "all" ? "All" : s}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={(o) => o.id ?? String(o.createdAt)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={
          filtered.length === 0 ? { flex: 1 } : { paddingBottom: SPACING.xxxl }
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <MaterialIcons
              name="receipt-long"
              size={64}
              color={COLORS.gray300}
            />
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
        renderItem={({ item: order }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>#{order.id?.slice(-8)}</Text>
              <Text style={styles.orderDate}>
                {new Date(order.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.orderCustomer}>
              {order.userName} {order.userSurname}
            </Text>
            <Text style={styles.orderAddress} numberOfLines={1}>
              📍 {order.deliveryAddress}
            </Text>
            <View style={styles.orderFooter}>
              <Text style={styles.orderTotal}>
                R{order.total.toLocaleString()}
              </Text>
              <TouchableOpacity
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      (STATUS_COLORS[order.status] || COLORS.gray400) + "20",
                  },
                ]}
                onPress={() => handleStatusChange(order)}
              >
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        STATUS_COLORS[order.status] || COLORS.gray400,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: STATUS_COLORS[order.status] || COLORS.gray400,
                    },
                  ]}
                >
                  {order.status}
                </Text>
                <MaterialIcons
                  name="arrow-drop-down"
                  size={16}
                  color={STATUS_COLORS[order.status] || COLORS.gray400}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  title: { ...TYPOGRAPHY.h3, color: COLORS.text },
  subtitle: { ...TYPOGRAPHY.body, color: COLORS.textLight },
  filtersRow: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  pill: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
  },
  pillActive: { backgroundColor: COLORS.primary },
  pillInactive: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  pillText: { ...TYPOGRAPHY.caption, color: COLORS.textLight },
  pillTextActive: { ...TYPOGRAPHY.captionBold, color: COLORS.white },
  orderCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    gap: SPACING.xs,
    ...SHADOWS.sm,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: { ...TYPOGRAPHY.bodyBold, color: COLORS.text },
  orderDate: { ...TYPOGRAPHY.caption, color: COLORS.textLight },
  orderCustomer: { ...TYPOGRAPHY.body, color: COLORS.text },
  orderAddress: { ...TYPOGRAPHY.caption, color: COLORS.textLight },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.xs,
  },
  orderTotal: { ...TYPOGRAPHY.h4, color: COLORS.primary },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: {
    ...TYPOGRAPHY.captionBold,
    textTransform: "capitalize",
  },
  emptyText: { ...TYPOGRAPHY.body, color: COLORS.textLight },
});
