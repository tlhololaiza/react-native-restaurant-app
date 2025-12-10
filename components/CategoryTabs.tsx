import { COLORS } from '@/utils/colors';
import { RADIUS, SPACING, TYPOGRAPHY } from '@/utils/theme';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface CategoryTabsProps {
  categories: { id: string; name: string }[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  horizontal?: boolean;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  horizontal = true,
}) => {
  if (horizontal) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.tab,
              activeCategory === category.id && styles.tabActive,
            ]}
            onPress={() => onCategoryChange(category.id)}
          >
            <Text
              style={[
                styles.tabText,
                activeCategory === category.id && styles.tabTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={styles.gridContainer}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.gridTab,
            activeCategory === category.id && styles.tabActive,
          ]}
          onPress={() => onCategoryChange(category.id)}
        >
          <Text
            style={[
              styles.tabText,
              activeCategory === category.id && styles.tabTextActive,
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  contentContainer: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginVertical: SPACING.md,
  },
  tab: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.gray100,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  gridTab: {
    flex: 1,
    minWidth: '45%',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.gray100,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.text,
  },
  tabTextActive: {
    color: COLORS.white,
  },
});
