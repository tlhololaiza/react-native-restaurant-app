import { COLORS } from '@/utils/colors';
import { RADIUS, SPACING, TYPOGRAPHY } from '@/utils/theme';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  icon?: string;
  error?: string;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  onIconPress?: () => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  icon,
  error,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  style,
  onIconPress,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(!secureTextEntry);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
          !editable && styles.inputContainerDisabled,
        ]}
      >
        {icon && (
          <MaterialIcons
            name={icon as any}
            size={20}
            color={COLORS.gray500}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray400}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? 'visibility-off' : 'visibility'}
              size={20}
              color={COLORS.gray500}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
        {icon && !secureTextEntry && onIconPress && (
          <TouchableOpacity onPress={onIconPress}>
            <MaterialIcons
              name="close"
              size={20}
              color={COLORS.gray500}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  inputContainerError: {
    borderColor: COLORS.error,
  },
  inputContainerDisabled: {
    backgroundColor: COLORS.gray100,
  },
  input: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    paddingVertical: SPACING.md,
  },
  icon: {
    marginHorizontal: SPACING.sm,
  },
  error: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    marginTop: SPACING.sm,
  },
});
