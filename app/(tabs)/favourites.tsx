import { FoodCard } from "@/components/FoodCard";
import { useCartStore } from "@/utils/cartStore";
import { COLORS } from "@/utils/colors";
import { useFavouritesStore } from "@/utils/favouritesStore";
import { commonStyles, SPACING, TYPOGRAPHY } from "@/utils/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function FavouritesScreen() {
  const favourites = useFavouritesStore((s) => s.items);
  const removeFavourite = useFavouritesStore((s) => s.removeFavourite);
  const { addItem } = useCartStore();

  const handlePress = (item: any) => {
    router.push({
      pathname: "/(modal)/item-details",
      params: { item: JSON.stringify(item) },
    });
  };

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="favorite-border" size={64} color={COLORS.gray300} />
      <Text style={styles.emptyTitle}>No favourites yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the heart to save dishes you love
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <Text style={styles.title}>Your Favourites</Text>
      <FlatList
        data={favourites}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <FoodCard
              id={item.id}
              image={item.image}
              name={item.name}
              price={item.price}
              onPress={() => handlePress(item)}
              onCartPress={() => handleAddToCart(item)}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  list: { paddingBottom: SPACING.xxxl },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  cardWrap: { flex: 1 },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.lg,
    minHeight: 300,
  },
  emptyTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, marginTop: SPACING.lg },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
    textAlign: "center",
  },
});
