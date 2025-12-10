import { Button } from '@/components/Button';
import { COLORS } from '@/utils/colors';
import { commonStyles, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '@/utils/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const EXTRAS = [
  { id: '1', name: 'Extra Cheese', price: 200 },
  { id: '2', name: 'Bacon', price: 300 },
  { id: '3', name: 'Mushrooms', price: 150 },
  { id: '4', name: 'Onions', price: 100 },
];

const SIDES = [
  { id: 's1', name: 'French Fries', price: 500 },
  { id: 's2', name: 'Coleslaw', price: 300 },
  { id: 's3', name: 'Jalapeño Poppers', price: 400 },
];

const REMOVE_OPTIONS = [
  { id: 'r1', name: 'Pickles' },
  { id: 'r2', name: 'Onions' },
  { id: 'r3', name: 'Tomato' },
  { id: 'r4', name: 'Lettuce' },
];

export default function EditExtrasScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [removedItems, setRemovedItems] = useState<string[]>([]);

  const toggleExtra = (extraId: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]
    );
  };

  const toggleRemove = (removeId: string) => {
    setRemovedItems((prev) =>
      prev.includes(removeId) ? prev.filter((id) => id !== removeId) : [...prev, removeId]
    );
  };

  const handleSaveExtras = () => {
    // TODO: Save extras to cart item
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Extras</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Add Extras Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Extras</Text>
          <Text style={styles.sectionSubtitle}>Select any extras you&apos;d like to add</Text>

          {EXTRAS.map((extra) => (
            <TouchableOpacity
              key={extra.id}
              style={styles.optionItem}
              onPress={() => toggleExtra(extra.id)}
            >
              <View
                style={[
                  styles.optionCheckbox,
                  selectedExtras.includes(extra.id) && styles.checkboxSelected,
                ]}
              >
                {selectedExtras.includes(extra.id) && (
                  <MaterialIcons name="check" size={16} color={COLORS.white} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionName}>{extra.name}</Text>
              </View>
              <Text style={styles.optionPrice}>+R{extra.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sides Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose a Side</Text>
          <Text style={styles.sectionSubtitle}>Pick your favorite side dish</Text>

          {SIDES.map((side) => (
            <TouchableOpacity
              key={side.id}
              style={styles.optionItem}
              onPress={() => toggleExtra(side.id)}
            >
              <View
                style={[
                  styles.optionCheckbox,
                  selectedExtras.includes(side.id) && styles.checkboxSelected,
                ]}
              >
                {selectedExtras.includes(side.id) && (
                  <MaterialIcons name="check" size={16} color={COLORS.white} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionName}>{side.name}</Text>
              </View>
              <Text style={styles.optionPrice}>+R{side.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Remove Ingredients Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Remove Ingredients</Text>
          <Text style={styles.sectionSubtitle}>Uncheck items you don&apos;t want</Text>

          {REMOVE_OPTIONS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.optionItem}
              onPress={() => toggleRemove(item.id)}
            >
              <View
                style={[
                  styles.removeCheckbox,
                  removedItems.includes(item.id) && styles.removeCheckboxSelected,
                ]}
              >
                {removedItems.includes(item.id) && (
                  <MaterialIcons name="close" size={16} color={COLORS.white} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionName}>{item.name}</Text>
              </View>
              <Text style={styles.optionStatus}>
                {removedItems.includes(item.id) ? 'Will remove' : 'Included'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Extras Added</Text>
            <Text style={styles.summaryValue}>
              {selectedExtras.length > 0 ? `+${selectedExtras.length}` : 'None'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items to Remove</Text>
            <Text style={styles.summaryValue}>
              {removedItems.length > 0 ? removedItems.length : 'None'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.bottomSection}>
        <Button
          title="Save Changes"
          onPress={handleSaveExtras}
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
    marginBottom: SPACING.sm,
  },
  sectionSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  optionCheckbox: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.sm,
    borderColor: COLORS.primary,
    borderWidth: 2,
    marginRight: SPACING.md,
    ...commonStyles.centered,
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
  },
  removeCheckbox: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.sm,
    borderColor: COLORS.gray300,
    borderWidth: 2,
    marginRight: SPACING.md,
    ...commonStyles.centered,
  },
  removeCheckboxSelected: {
    backgroundColor: COLORS.error,
    borderColor: COLORS.error,
  },
  optionName: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.text,
    flex: 1,
  },
  optionPrice: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.primary,
    fontWeight: '700',
  },
  optionStatus: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
    marginBottom: SPACING.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.md,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  summaryLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
  },
  summaryValue: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.text,
  },
  bottomSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
  },
});