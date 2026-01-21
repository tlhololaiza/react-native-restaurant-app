import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        presentation: 'modal',
      }}
    >
      <Stack.Screen
        name="item-details"
        options={{
          animationEnabled: true,
        }}
      />
      <Stack.Screen
        name="edit-extras"
        options={{
          animationEnabled: true,
        }}
      />
      <Stack.Screen
        name="checkout"
        options={{
          animationEnabled: true,
        }}
      />
      <Stack.Screen
        name="order-success"
        options={{
          animationEnabled: false,
        }}
      />
    </Stack>
  );
}
