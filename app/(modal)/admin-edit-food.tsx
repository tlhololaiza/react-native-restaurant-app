import { FoodCategory, FoodItem, updateFoodItem } from "@/services/foodService";
import { COLORS } from "@/utils/colors";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/utils/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const CATEGORIES: FoodCategory[] = [
  "burgers",
  "pizza",
  "chicken",
  "mains",
  "starters",
  "sides",
  "desserts",
  "drinks",
];

export default function AdminEditFood() {
  const params = useLocalSearchParams<{ item?: string }>();
  const existing: FoodItem | null = params.item
    ? (JSON.parse(params.item) as FoodItem)
    : null;

  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [price, setPrice] = useState(String(existing?.price ?? ""));
  const [category, setCategory] = useState<FoodCategory>(
    existing?.category ?? "burgers",
  );
  const [image, setImage] = useState(existing?.image ?? "");
  const [rating, setRating] = useState(String(existing?.rating ?? "4.5"));
  const [loading, setLoading] = useState(false);

  if (!existing) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ padding: SPACING.lg, color: COLORS.error }}>
          No item data received.
        </Text>
      </SafeAreaView>
    );
  }

  const validate = () => {
    if (!name.trim()) return "Name is required";
    if (!description.trim()) return "Description is required";
    if (!price || isNaN(Number(price)) || Number(price) <= 0)
      return "Enter a valid price";
    if (!image.trim()) return "Image URL is required";
    return null;
  };

  const handleSave = async () => {
    const error = validate();
    if (error) {
      Alert.alert("Validation", error);
      return;
    }

    setLoading(true);
    try {
      await updateFoodItem(existing.id, {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        category,
        image: image.trim(),
        rating: Number(rating) || 4.5,
      });
      Alert.alert("Success", "Item updated!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Menu Item</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          <Field label="Name *">
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Classic Burger"
              placeholderTextColor={COLORS.gray400}
            />
          </Field>

          <Field label="Description *">
            <TextInput
              style={[styles.input, styles.multiline]}
              value={description}
              onChangeText={setDescription}
              placeholder="Brief description..."
              placeholderTextColor={COLORS.gray400}
              multiline
              numberOfLines={3}
            />
          </Field>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Field label="Price (R) *">
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="89"
                  placeholderTextColor={COLORS.gray400}
                  keyboardType="numeric"
                />
              </Field>
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Rating">
                <TextInput
                  style={styles.input}
                  value={rating}
                  onChangeText={setRating}
                  placeholder="4.5"
                  placeholderTextColor={COLORS.gray400}
                  keyboardType="numeric"
                />
              </Field>
            </View>
          </View>

          <Field label="Image URL *">
            <TextInput
              style={styles.input}
              value={image}
              onChangeText={setImage}
              placeholder="https://..."
              placeholderTextColor={COLORS.gray400}
              autoCapitalize="none"
              keyboardType="url"
            />
          </Field>

          <Field label="Category">
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    category === cat && styles.categoryChipActive,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      category === cat && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Field>

          <TouchableOpacity
            style={[styles.saveBtn, loading && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveBtnText}>
              {loading ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: { ...TYPOGRAPHY.h4, color: COLORS.text },
  form: { padding: SPACING.lg, gap: SPACING.sm },
  fieldContainer: { marginBottom: SPACING.md },
  fieldLabel: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  multiline: {
    height: 90,
    textAlignVertical: "top",
    paddingTop: SPACING.md,
  },
  row: { flexDirection: "row", gap: SPACING.md },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  categoryChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.gray100,
    borderWidth: 1,
    borderColor: "transparent",
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text,
    textTransform: "capitalize",
  },
  categoryChipTextActive: { color: COLORS.white, fontWeight: "700" },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    alignItems: "center",
    marginTop: SPACING.md,
  },
  saveBtnText: { ...TYPOGRAPHY.bodyBold, color: COLORS.white },
});
