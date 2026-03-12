# React Native Restaurant App

A simple restaurant ordering app built with Expo and React Native. Browse menu items by category, view item details (with extras and sides), add items to a cart, and place orders. Authentication and order persistence are handled with AsyncStorage (local device storage).

## Features

- Browse food items by category
- View item details and select extras/sides
- Add items to cart and update quantities
- Checkout — orders saved to AsyncStorage (`services/orderService.ts`)
- Email/password auth and user profiles via AsyncStorage (`services/firebase.ts`)
- Local mock data fallback and seeding helper (`services/foodService.ts`, `utils/seedService.ts`)

## Quick start

1. Install dependencies

```bash
npm install
```

2. Start the app

```bash
npx expo start
```

Then open the app in an emulator, simulator, or Expo Go.

## Project structure (high level)

- `app/` — route-based screens (tabs, auth, modals)
- `components/` — reusable UI components (Button, FoodCard, SearchBar)
- `context/` — providers (Auth)
- `services/` — local storage integration, food and order services
- `utils/` — stores (`zustand`), theming, seed helpers

## Local storage

This project stores user profiles, sessions, food items and orders using `@react-native-async-storage/async-storage` via the `services` helpers. The code used to depend on Firebase/Firestore; it now uses AsyncStorage so the app works offline and without a backend during development.

## Notes for development

- The app uses `zustand` for local state management (`utils/cartStore.ts`, `utils/authStore.ts`).
- If Firestore is unavailable, the app falls back to mock data and includes a seeding helper (`utils/seedService.ts`).

## Want help?

If you want, I can:

- Run the app locally (`npm install` then `npx expo start`)
- Add a short CONTRIBUTING section or deployment notes
- Create a Git commit for this README update

---

Generated/updated by project maintainer tools.
