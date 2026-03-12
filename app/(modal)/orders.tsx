import { getUserOrders, Order } from "@/services/orderService";
import { useAuthStore } from "@/utils/authStore";
import { COLORS } from "@/utils/colors";
import { commonStyles, RADIUS, SPACING, TYPOGRAPHY } from "@/utils/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const STATUS_OPTIONS: Array<string> = [
  "all",
  "pending",
  "confirmed",
  "preparing",
  "delivering",
  "delivered",
  "cancelled",
];
const DATE_OPTIONS = ["all", "7d", "30d"] as const;

export default function OrdersModal() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] =
    useState<(typeof DATE_OPTIONS)[number]>("all");

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      setFetchError(null);
      try {
        const list = await getUserOrders(user.uid);
        setOrders(list);
      } catch (e: any) {
        console.error("Failed to load orders:", e?.message || e);
        setFetchError(e?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const filtered = useMemo(() => {
    let res = orders.slice();
    if (statusFilter && statusFilter !== "all") {
      res = res.filter((o) => o.status === statusFilter);
    }
    if (dateFilter !== "all") {
      const now = Date.now();
      const days = dateFilter === "7d" ? 7 : 30;
      const cutoff = now - days * 24 * 60 * 60 * 1000;
      res = res.filter((o) => o.createdAt >= cutoff);
    }
    return res;
  }, [orders, statusFilter, dateFilter]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="history" size={64} color={COLORS.gray300} />
      <Text style={styles.emptyTitle}>No orders found</Text>
      <Text style={styles.emptySubtitle}>
        Your recent orders will appear here
      </Text>
    </View>
  );

  const handleOpen = (order: Order) => {
    router.push({
      pathname: "/(modal)/order-details",
      params: { id: order.id },
    });
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Order History</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.filtersRow}>
        <View style={styles.pillsRow}>
          {STATUS_OPTIONS.map((s) => (
            <TouchableOpacity
              key={s}
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
          ))}
        </View>
        <View style={styles.dateRow}>
          {DATE_OPTIONS.map((d) => (
            <TouchableOpacity
              key={d}
              onPress={() => setDateFilter(d)}
              style={{ marginRight: SPACING.sm }}
            >
              <Text style={styles.dateText}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {fetchError && (
        <Text
          style={{
            color: COLORS.error,
            paddingHorizontal: SPACING.lg,
            paddingBottom: SPACING.sm,
          }}
        >
          {fetchError}
        </Text>
      )}
      <FlatList
        data={filtered}
        keyExtractor={(o) => o.id ?? String(Math.random())}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderCard}
            onPress={() => handleOpen(item)}
          >
            <View style={styles.orderRow}>
              <Text style={styles.orderId}>Order #{item.id?.slice(-6)}</Text>
              <Text style={styles.orderDate}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderTotal}>
                R{item.total.toLocaleString()}
              </Text>
              <Text style={styles.orderStatus}>{item.status}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={loading ? null : renderEmpty}
        contentContainerStyle={filtered.length === 0 ? { flex: 1 } : undefined}
      />
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
  filtersRow: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
  pillsRow: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm },
  pill: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    marginRight: SPACING.sm,
  },
  pillActive: { backgroundColor: COLORS.primary },
  pillInactive: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  pillText: { ...TYPOGRAPHY.caption, color: COLORS.textLight },
  pillTextActive: { ...TYPOGRAPHY.captionBold, color: COLORS.white },
  dateRow: { flexDirection: "row", marginTop: SPACING.sm },
  dateText: { ...TYPOGRAPHY.caption, color: COLORS.textLight },
  orderCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    ...{ elevation: 1 },
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: { ...TYPOGRAPHY.bodyBold, color: COLORS.text },
  orderDate: { ...TYPOGRAPHY.caption, color: COLORS.textLight },
  orderTotal: { ...TYPOGRAPHY.h4, color: COLORS.primary },
  orderStatus: { ...TYPOGRAPHY.captionBold, color: COLORS.text },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.lg,
  },
  emptyTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, marginTop: SPACING.lg },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
  },
});
