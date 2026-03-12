import { useAuthStore } from "@/utils/authStore";
import { COLORS } from "@/utils/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import { useEffect } from "react";

export default function AdminLayout() {
  const { user, userProfile } = useAuthStore();

  useEffect(() => {
    if (user === null) {
      router.replace("/(auth)/login");
    } else if (userProfile !== null && !userProfile?.isAdmin) {
      router.replace("/(tabs)/home");
    }
  }, [user, userProfile]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray400,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="receipt-long" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="food-items"
        options={{
          title: "Menu",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="fastfood" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
