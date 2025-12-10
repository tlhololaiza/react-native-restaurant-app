import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  SplashScreen.hideAsync();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="splash"
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="(auth)"
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="(modal)"
        options={{
          presentation: 'modal',
          gestureEnabled: true,
        }}
      />
      <Stack.Screen name="index" />
    </Stack>
  );
}
