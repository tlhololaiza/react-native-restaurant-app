import { CategoryTabs } from "@/components/CategoryTabs";
import { COLORS } from "@/utils/colors";
import { SPACING, TYPOGRAPHY } from "@/utils/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type Category = { id: string; name: string };

type Props = {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  title?: string;
  icon?: string;
  iconColor?: string;
};

export const CategoriesSection = ({
  categories,
  activeCategory,
  onCategoryChange,
  title = "Categories",
  icon,
  iconColor = COLORS.primary,
}: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {icon ? (
          <MaterialIcons name={icon as any} size={20} color={iconColor} />
        ) : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
  },
});
