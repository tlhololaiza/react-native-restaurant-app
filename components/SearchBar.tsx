import { COLORS } from '@/utils/colors';
import { RADIUS, SPACING, TYPOGRAPHY } from '@/utils/theme';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onPress?: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onPress,
  placeholder = 'Search for food...',
}) => {
  return (
    <View style={styles.container}>
      <MaterialIcons
        name="search"
        size={20}
        color={COLORS.gray400}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray400}
        value={value}
        onChangeText={onChangeText}
        onPress={onPress}
      />
      {value && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <MaterialIcons
            name="close"
            size={20}
            color={COLORS.gray400}
            style={styles.clearIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  clearIcon: {
    marginLeft: SPACING.sm,
  },
});
