import { Button } from '@/components/Button';
import { InputField } from '@/components/InputField';
import { COLORS } from '@/utils/colors';
import { commonStyles, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '@/utils/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.replace('/(tabs)/home');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Login</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Image
                source={require('../../assets/logo/logo.jpg')}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to continue to FoodHub</Text>
            <View style={styles.decorativeLine} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            <InputField
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              icon="mail"
              error={errors.email}
            />

            <InputField
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
            />

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
            fullWidth
            size="lg"
          />

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.signupLink}>Create Account</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={commonStyles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={commonStyles.divider} />
          </View>

          {/* Social Login */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <MaterialIcons name="public" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <MaterialIcons name="phone-android" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    ...commonStyles.centered,
    marginBottom: SPACING.xl,
    overflow: 'hidden',
    ...SHADOWS.md,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  decorativeLine: {
    width: 60,
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xs,
    marginTop: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  form: {
    marginBottom: SPACING.xl,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: SPACING.sm,
  },
  forgotPasswordText: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.primary,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  signupText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
  },
  signupLink: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xl,
    gap: SPACING.md,
  },
  dividerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.lg,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    ...commonStyles.centered,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
});
