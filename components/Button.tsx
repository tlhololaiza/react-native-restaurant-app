import { COLORS } from '@/utils/colors';
import { RADIUS, SPACING, TYPOGRAPHY } from '@/utils/theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
}) => {
  const isDisabled = disabled || loading;

  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.variantPrimary;
      case 'secondary':
        return styles.variantSecondary;
      case 'outline':
        return styles.variantOutline;
      case 'danger':
        return styles.variantDanger;
      default:
        return styles.variantPrimary;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.sizeSm;
      case 'md':
        return styles.sizeMd;
      case 'lg':
        return styles.sizeLg;
      default:
        return styles.sizeMd;
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') return COLORS.primary;
    return COLORS.white;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.button,
        getVariantStyle(),
        getSizeStyle(),
        isDisabled && styles.disabled,
        fullWidth && styles.fullWidth,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
    flexDirection: 'row',
  },
  sizeSm: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  sizeMd: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  sizeLg: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    ...TYPOGRAPHY.bodyBold,
    fontWeight: '600',
  },
  variantPrimary: {
    backgroundColor: COLORS.primary,
  },
  variantSecondary: {
    backgroundColor: COLORS.gray200,
  },
  variantOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  variantDanger: {
    backgroundColor: COLORS.error,
  },
  disabled: {
    opacity: 0.5,
  },
});