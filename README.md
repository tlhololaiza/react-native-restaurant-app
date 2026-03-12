# React Native Restaurant App

A full-featured restaurant ordering app built with **Expo** and **React Native**. Customers can browse the menu, add items to a cart, and place orders. An admin panel lets managers track orders and manage food items. Authentication and data persistence are powered by **Firebase Auth** and **Firestore**.

---

## Features

### Customer

- Browse food items organised by category
- Search for items by name or keyword
- View item details and select extras / sides
- Add items to cart, adjust quantities, and remove items
- Save favourite items for quick access
- Checkout and place orders
- View order history and real-time order status
- Edit user profile (name, surname, phone, address)

### Admin

- Dashboard with live analytics (total orders, revenue, pending orders, top items)
- Manage food items — add, edit, and delete menu items
- View and update order statuses
- Login Credentials (email: admin@foodhub.com || password: admin123) 

---

## Tech Stack

| Layer            | Technology                                                             |
| ---------------- | ---------------------------------------------------------------------- |
| Framework        | [Expo](https://expo.dev) (SDK 54) + React Native 0.81                  |
| Navigation       | [Expo Router](https://expo.github.io/router) (file-based routing)      |
| Auth & Database  | Firebase Auth + Cloud Firestore                                        |
| Local Storage    | `@react-native-async-storage/async-storage` (order caching / fallback) |
| State Management | [Zustand](https://github.com/pmndrs/zustand) (cart, auth, favourites)  |
| UI               | `@expo/vector-icons`, `expo-linear-gradient`, `expo-image`             |
| Animations       | `react-native-reanimated`                                              |
| Language         | TypeScript                                                             |

---

## Project Structure

```
app/
  _layout.tsx          # Root layout & splash handling
  index.tsx            # Entry point — redirects based on auth state
  (auth)/              # Login & Register screens
  (tabs)/              # Bottom-tab screens: Home, Search, Favourites, Cart, Profile
  (admin)/             # Admin screens: Dashboard, Food Items, Orders
  (modal)/             # Modal screens: Item Details, Checkout, Order Details, etc.
components/            # Reusable UI — Button, FoodCard, SearchBar, CategoryTabs, etc.
context/
  AuthContext.tsx      # Firebase auth state provider
services/
  firebaseClient.ts    # Firebase app initialisation
  firebase.ts          # Auth & Firestore user profile helpers
  foodService.ts       # CRUD for food items (Firestore + local fallback)
  orderService.ts      # Order creation, retrieval and status updates
utils/
  authStore.ts         # Zustand auth store
  cartStore.ts         # Zustand cart store
  favouritesStore.ts   # Zustand favourites store
  categories.ts        # Category definitions
  colors.ts            # Design tokens — colours
  theme.ts             # Design tokens — spacing, typography, shadows
  seedService.ts       # Helper to seed Firestore with sample food data
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- A Firebase project (see [Firebase Setup](#firebase-setup) below)

### Install & Run

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

Then press:

- `a` — open on Android emulator
- `i` — open on iOS simulator
- `w` — open in web browser
- Scan the QR code with **Expo Go** on a physical device

### Environment Variables

Create a `.env` file in the project root with your Firebase config:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## Firebase Setup

See [FIRESTORE_SETUP.md](FIRESTORE_SETUP.md) for the full step-by-step guide. The required steps are:

1. Enable **Email/Password** sign-in in Firebase Authentication
2. Create a **Firestore Database** in your Firebase project
3. Set **Firestore security rules** (rules are documented in `FIRESTORE_SETUP.md`)

---

## Available Scripts

| Script            | Description               |
| ----------------- | ------------------------- |
| `npm start`       | Start the Expo dev server |
| `npm run android` | Start on Android          |
| `npm run ios`     | Start on iOS              |
| `npm run web`     | Start in browser          |
| `npm run lint`    | Run ESLint                |

---

## Notes

- If Firestore is unavailable the app falls back to local mock data. Use `utils/seedService.ts` to populate Firestore with sample food items.
- The admin role is determined by a flag on the Firestore user document. Seed an admin user manually or via the seed helper.
- The app uses Expo Router's file-based routing. Route groups (`(tabs)`, `(auth)`, `(admin)`, `(modal)`) do not appear in the URL path.
