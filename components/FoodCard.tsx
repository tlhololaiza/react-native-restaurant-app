import { COLORS } from '@/utils/colors';
import { RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '@/utils/theme';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - SPACING.lg * 2 - SPACING.md) / 2;

interface FoodCardProps {
  id: string;
  image: string;
  name: string;
  price: number;
  rating?: number;
  onPress: () => void;
  onCartPress?: () => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  id,
  image,
  name,
  price,
  rating = 4.5,
  onPress,
  onCartPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
        />
        {rating && (
          <View style={styles.ratingBadge}>
            <MaterialIcons name="star" size={14} color={COLORS.white} />
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>R{price.toLocaleString()}</Text>
          {onCartPress && (
            <TouchableOpacity
              style={styles.cartButton}
              onPress={onCartPress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialIcons name="add-circle" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.md,
    marginBottom: SPACING.lg,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
    backgroundColor: COLORS.gray100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.gray900,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.white,
  },
  content: {
    padding: SPACING.md,
  },
  name: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    height: 40,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    fontWeight: '700',
  },
  cartButton: {
    padding: 4,
  },
});
