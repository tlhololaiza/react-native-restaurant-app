import { logoutUser } from "@/services/firebase";
import { getFoodItems } from "@/services/foodService";
import { getAllOrders } from "@/services/orderService";
import { useAuthStore } from "@/utils/authStore";
import { COLORS } from "@/utils/colors";
import { RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from "@/utils/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface Analytics {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  todayOrders: number;
  statusCounts: Record<string, number>;
  topItems: { name: string; count: number }[];
  totalFoodItems: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending: COLORS.warning,
  confirmed: COLORS.info,
  preparing: "#8B5CF6",
  delivering: "#F97316",
  delivered: COLORS.success,
  cancelled: COLORS.error,
};

export default function AdminDashboard() {
  const { setUser, setUserProfile } = useAuthStore();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const [orders, foods] = await Promise.all([
        getAllOrders(),
        getFoodItems(),
      ]);

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const statusCounts: Record<string, number> = {
        pending: 0,
        confirmed: 0,
        preparing: 0,
        delivering: 0,
        delivered: 0,
        cancelled: 0,
      };
      const itemCounts: Record<string, number> = {};
      let totalRevenue = 0;
      let todayOrders = 0;

      orders.forEach((order) => {
        statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
        totalRevenue += order.total;
        if (order.createdAt >= todayStart.getTime()) todayOrders++;
        order.items.forEach((item) => {
          itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
        });
      });

      const topItems = Object.entries(itemCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setAnalytics({
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders: statusCounts.pending,
        todayOrders,
        statusCounts,
        topItems,
        totalFoodItems: foods.length,
      });
    } catch (error) {
      console.error("Analytics error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logoutUser();
          setUser(null);
          setUserProfile(null);
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const StatCard = ({
    title,
    value,
    icon,
    color = COLORS.primary,
  }: {
    title: string;
    value: string | number;
    icon: string;
    color?: string;
  }) => (
    <View style={styles.statCard}>
      <MaterialIcons name={icon as any} size={28} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
            <Text style={styles.headerSubtitle}>FoodHub Management</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <MaterialIcons name="logout" size={22} color={COLORS.error} />
          </TouchableOpacity>
        </View>

        {analytics && (
          <>
            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <StatCard
                title="Total Orders"
                value={analytics.totalOrders}
                icon="receipt-long"
              />
              <StatCard
                title="Revenue"
                value={`R${analytics.totalRevenue.toLocaleString()}`}
                icon="payments"
                color={COLORS.success}
              />
              <StatCard
                title="Pending"
                value={analytics.pendingOrders}
                icon="pending-actions"
                color={COLORS.warning}
              />
              <StatCard
                title="Today"
                value={analytics.todayOrders}
                icon="today"
                color={COLORS.info}
              />
            </View>

            {/* Menu items count */}
            <View style={[styles.statCard, styles.wideCard]}>
              <MaterialIcons name="fastfood" size={28} color={COLORS.primary} />
              <Text style={styles.statValue}>{analytics.totalFoodItems}</Text>
              <Text style={styles.statTitle}>Menu Items</Text>
            </View>

            {/* Status Distribution */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Orders by Status</Text>
              {Object.entries(analytics.statusCounts).map(([status, count]) => (
                <View key={status} style={styles.statusRow}>
                  <View style={styles.statusLabelRow}>
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor:
                            STATUS_COLORS[status] || COLORS.gray400,
                        },
                      ]}
                    />
                    <Text style={styles.statusLabel}>{status}</Text>
                  </View>
                  <View style={styles.statusBarTrack}>
                    <View
                      style={[
                        styles.statusBarFill,
                        {
                          width:
                            analytics.totalOrders > 0
                              ? `${(count / analytics.totalOrders) * 100}%`
                              : "0%",
                          backgroundColor:
                            STATUS_COLORS[status] || COLORS.gray400,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.statusCount}>{count}</Text>
                </View>
              ))}
            </View>

            {/* Top Items */}
            {analytics.topItems.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Top Ordered Items</Text>
                {analytics.topItems.map((item, i) => (
                  <View
                    key={item.name}
                    style={[
                      styles.topItemRow,
                      i === analytics.topItems.length - 1 && {
                        borderBottomWidth: 0,
                      },
                    ]}
                  >
                    <View style={styles.rankBadge}>
                      <Text style={styles.rankText}>#{i + 1}</Text>
                    </View>
                    <Text style={styles.topItemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.topItemCount}>
                      {item.count} ordered
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  headerTitle: { ...TYPOGRAPHY.h3, color: COLORS.text },
  headerSubtitle: { ...TYPOGRAPHY.caption, color: COLORS.textLight },
  logoutBtn: {
    padding: SPACING.sm,
    backgroundColor: "rgba(239,68,68,0.1)",
    borderRadius: RADIUS.full,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: "center",
    gap: SPACING.xs,
    ...SHADOWS.sm,
  },
  wideCard: {
    flexDirection: "row",
    minWidth: "100%",
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    justifyContent: "center",
    gap: SPACING.md,
  },
  statValue: { ...TYPOGRAPHY.h3, color: COLORS.text },
  statTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    textAlign: "center",
  },
  section: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  statusLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    width: 100,
    gap: SPACING.xs,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text,
    textTransform: "capitalize",
  },
  statusBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.gray100,
    borderRadius: RADIUS.full,
    overflow: "hidden",
  },
  statusBarFill: { height: "100%", borderRadius: RADIUS.full },
  statusCount: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.text,
    width: 24,
    textAlign: "right",
  },
  topItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  rankText: { ...TYPOGRAPHY.captionBold, color: COLORS.white },
  topItemName: { flex: 1, ...TYPOGRAPHY.body, color: COLORS.text },
  topItemCount: { ...TYPOGRAPHY.caption, color: COLORS.textLight },
});
