import { Button } from '@/components/Button';
import { COLORS } from '@/utils/colors';
import { RADIUS, SPACING, TYPOGRAPHY, commonStyles } from '@/utils/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';

const { height, width } = Dimensions.get('window');

export default function OrderSuccessScreen() {
  const { orderNumber } = useLocalSearchParams<{ orderNumber: string }>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Animation */}
        <View style={styles.animationContainer}>
          <View style={styles.successIcon}>
            <MaterialIcons name="check-circle" size={100} color={COLORS.primary} />
          </View>
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your delicious food is being prepared and will be delivered soon
        </Text>

        {/* Order Details */}
        <View style={styles.orderDetailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order Number</Text>
            <Text style={styles.detailValue}>#{orderNumber || '12345678'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimated Time</Text>
            <Text style={styles.detailValue}>30-45 minutes</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Amount</Text>
            <Text style={styles.detailValue}>₦4,000</Text>
          </View>
        </View>

        {/* Status Steps */}
        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={[styles.stepIcon, styles.stepIconActive]}>
              <MaterialIcons name="check" size={20} color={COLORS.white} />
            </View>
            <Text style={styles.stepLabel}>Confirmed</Text>
          </View>

          <View style={styles.stepLine} />

          <View style={styles.step}>
            <View style={styles.stepIcon}>
              <MaterialIcons name="local-shipping" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.stepLabel}>Preparing</Text>
          </View>

          <View style={styles.stepLine} />

          <View style={styles.step}>
            <View style={styles.stepIcon}>
              <MaterialIcons name="pedal-bike" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.stepLabel}>Delivering</Text>
          </View>

          <View style={styles.stepLine} />

          <View style={styles.step}>
            <View style={styles.stepIcon}>
              <MaterialIcons name="check" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.stepLabel}>Delivered</Text>
          </View>
        </View>

        {/* Additional Info */}
        <View style={styles.infoCard}>
          <MaterialIcons name="info" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>
            A notification will be sent to your phone as your order progresses
          </Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.bottomSection}>
        <Button
          title="Track Order"
          onPress={() => {
            // TODO: Navigate to order tracking
            router.replace('/(tabs)/home');
          }}
          fullWidth
          size="lg"
        />
        <Button
          title="Return to Home"
          onPress={() => router.replace('/(tabs)/home')}
          variant="outline"
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
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    justifyContent: 'center',
  },
  animationContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    ...commonStyles.centered,
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xxxl,
  },
  orderDetailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  detailLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
  },
  detailValue: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  step: {
    alignItems: 'center',
    flex: 1,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    borderColor: COLORS.primary,
    borderWidth: 2,
    ...commonStyles.centered,
    marginBottom: SPACING.sm,
  },
  stepIconActive: {
    backgroundColor: COLORS.primary,
  },
  stepLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  stepLine: {
    height: 2,
    backgroundColor: COLORS.primary,
    flex: 1,
    marginHorizontal: -SPACING.sm,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
    alignItems: 'flex-start',
  },
  infoText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text,
    flex: 1,
  },
  bottomSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.white,
    gap: SPACING.lg,
  },
});