import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: 700 as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: 700 as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: 700 as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: 700 as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: 400 as const,
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: 600 as const,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 500 as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: 400 as const,
    lineHeight: 16,
  },
  captionBold: {
    fontSize: 12,
    fontWeight: 600 as const,
    lineHeight: 16,
  },
} as const;

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    ...SHADOWS.sm,
    padding: SPACING.lg,
  },
  input: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 16,
    color: COLORS.text,
  },
  button: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
});
