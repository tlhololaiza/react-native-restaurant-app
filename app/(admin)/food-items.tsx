import { deleteFoodItem, FoodItem, getFoodItems } from "@/services/foodService";
import { COLORS } from "@/utils/colors";
import { RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from "@/utils/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AdminFoodItems() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const list = await getFoodItems();
      setItems(list);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load food items");
    } finally {
      setLoading(false);
    }
  };

  // Refresh list every time screen comes into focus (after add/edit)
  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, []),
  );

  const handleDelete = (item: FoodItem) => {
    Alert.alert(
      "Delete Item",
      `Delete "${item.name}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFoodItem(item.id);
              setItems((prev) => prev.filter((i) => i.id !== item.id));
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to delete item");
            }
          },
        },
      ],
    );
  };

  const handleEdit = (item: FoodItem) => {
    router.push({
      pathname: "/(modal)/admin-edit-food" as any,
      params: { item: JSON.stringify(item) },
    });
  };

  const handleAdd = () => {
    router.push("/(modal)/admin-add-food" as any);
  };

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
        <View>
          <Text style={styles.title}>Menu Items</Text>
          <Text style={styles.subtitle}>{items.length} items</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <MaterialIcons name="add" size={22} color={COLORS.white} />
          <Text style={styles.addBtnText}>Add Item</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          items.length === 0 ? { flex: 1 } : { paddingBottom: SPACING.xxxl }
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <MaterialIcons name="fastfood" size={64} color={COLORS.gray300} />
            <Text style={styles.emptyText}>No food items</Text>
            <Text style={styles.emptySubtitle}>
              Tap "Add Item" to get started
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={styles.itemMeta}>
                <Text style={styles.itemCategory}>{item.category}</Text>
                <Text style={styles.itemPrice}>R{item.price}</Text>
              </View>
              <Text style={styles.itemDesc} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => handleEdit(item)}
              >
                <MaterialIcons name="edit" size={18} color={COLORS.info} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item)}
              >
                <MaterialIcons name="delete" size={18} color={COLORS.error} />
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
    gap: SPACING.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  title: { ...TYPOGRAPHY.h3, color: COLORS.text },
  subtitle: { ...TYPOGRAPHY.caption, color: COLORS.textLight },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    gap: SPACING.xs,
  },
  addBtnText: { ...TYPOGRAPHY.captionBold, color: COLORS.white },
  itemCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    ...SHADOWS.sm,
  },
  itemImage: { width: 90, height: 90 },
  itemInfo: { flex: 1, padding: SPACING.sm, gap: 2 },
  itemName: { ...TYPOGRAPHY.bodyBold, color: COLORS.text },
  itemMeta: { flexDirection: "row", gap: SPACING.sm, alignItems: "center" },
  itemCategory: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    overflow: "hidden",
    textTransform: "capitalize",
  },
  itemPrice: { ...TYPOGRAPHY.bodyBold, color: COLORS.primary },
  itemDesc: { ...TYPOGRAPHY.caption, color: COLORS.textLight },
  itemActions: {
    justifyContent: "space-around",
    paddingHorizontal: SPACING.sm,
  },
  editBtn: {
    padding: SPACING.sm,
    backgroundColor: COLORS.info + "15",
    borderRadius: RADIUS.sm,
  },
  deleteBtn: {
    padding: SPACING.sm,
    backgroundColor: COLORS.error + "15",
    borderRadius: RADIUS.sm,
  },
  emptyText: { ...TYPOGRAPHY.h4, color: COLORS.text },
  emptySubtitle: { ...TYPOGRAPHY.body, color: COLORS.textLight },
});
