import { Button } from '@/components/Button';
import { COLORS } from '@/utils/colors';
import { RADIUS, SPACING, TYPOGRAPHY, commonStyles } from '@/utils/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={[commonStyles.centered, { flex: 1 }]}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <MaterialIcons name="restaurant" size={80} color={COLORS.white} />
        </View>

        <Text style={styles.appName}>FoodHub</Text>
        <Text style={styles.tagline}>Fresh Food, Fast Delivery</Text>
      </View>

      {/* Get Started Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Get Started"
          fullWidth
          size="lg"
          onPress={() => router.push('/(auth)/login')}
        />
        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text
            style={styles.loginLink}
            onPress={() => router.push('/(auth)/login')}
          >
            Login
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    ...commonStyles.centered,
    marginBottom: SPACING.xl,
  },
  appName: {
    ...TYPOGRAPHY.h1,
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  tagline: {
    ...TYPOGRAPHY.subtitle,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: SPACING.xl,
    gap: SPACING.lg,
  },
  loginText: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    textAlign: 'center',
  },
  loginLink: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
