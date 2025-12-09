import { Button } from '@/components/Button';
import { InputField } from '@/components/InputField';
import { COLORS } from '@/utils/colors';
import { SPACING, TYPOGRAPHY } from '@/utils/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    cardNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateForm = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'First name is required';
    if (!formData.surname) newErrors.surname = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
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
            <Text style={styles.headerTitle}>Create Account</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.row}>
              <InputField
                label="First Name"
                placeholder="John"
                value={formData.name}
                onChangeText={(value) => updateForm('name', value)}
                error={errors.name}
                style={styles.halfInput}
              />
              <InputField
                label="Last Name"
                placeholder="Doe"
                value={formData.surname}
                onChangeText={(value) => updateForm('surname', value)}
                error={errors.surname}
                style={styles.halfInput}
              />
            </View>

            <InputField
              label="Email Address"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChangeText={(value) => updateForm('email', value)}
              keyboardType="email-address"
              icon="mail"
              error={errors.email}
            />

            <InputField
              label="Password"
              placeholder="Create a strong password"
              value={formData.password}
              onChangeText={(value) => updateForm('password', value)}
              secureTextEntry
              error={errors.password}
            />

            <InputField
              label="Delivery Address"
              placeholder="123 Street Name, City"
              value={formData.address}
              onChangeText={(value) => updateForm('address', value)}
              icon="location-on"
              error={errors.address}
            />

            <InputField
              label="Phone Number"
              placeholder="+234 800 000 0000"
              value={formData.phone}
              onChangeText={(value) => updateForm('phone', value)}
              keyboardType="phone-pad"
              icon="phone"
              error={errors.phone}
            />

            <InputField
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChangeText={(value) => updateForm('cardNumber', value)}
              keyboardType="numeric"
              icon="credit-card"
              error={errors.cardNumber}
            />
          </View>

          {/* Register Button */}
          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            fullWidth
            size="lg"
          />

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.loginLink}>Login</Text>
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
  form: {
    marginBottom: SPACING.xl,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfInput: {
    flex: 1,
    marginBottom: SPACING.lg,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  loginText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
  },
  loginLink: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary,
  },
});
