import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_USERS = "@foodhub:users";
const KEY_AUTH = "@foodhub:auth";
const KEY_ORDERS = "@foodhub:orders";
const KEY_FOODS = "@foodhub:foods";

// Minimal user type used throughout the app (replaces firebase.User)
export type User = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
};

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  surname: string;
  phone: string;
  address: string;
  cardNumber: string;
  cardHolder?: string;
  cardExpiry?: string;
  cardCVV?: string;
  createdAt: number;
  updatedAt: number;
}

type StoredUserRecord = {
  uid: string;
  email: string;
  password: string;
  profile: UserProfile;
};

let authListeners: Array<(u: User | null) => void> = [];

const notifyAuthChange = (user: User | null) => {
  authListeners.forEach((cb) => cb(user));
};

const readJson = async <T>(key: string, fallback: T): Promise<T> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (e) {
    return fallback;
  }
};

const writeJson = async (key: string, value: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

// Register a new user (stores credentials + profile in AsyncStorage)
export const registerUser = async (
  email: string,
  password: string,
  userData: Omit<UserProfile, "uid" | "createdAt" | "updatedAt" | "email">,
): Promise<User> => {
  const users = await readJson<Record<string, StoredUserRecord>>(KEY_USERS, {});

  // Prevent duplicate email
  const exists = Object.values(users).find((u) => u.email === email);
  if (exists) throw new Error("Email already in use");

  const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const profile: UserProfile = {
    uid,
    email,
    ...userData,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  users[uid] = {
    uid,
    email,
    password,
    profile,
  };

  await writeJson(KEY_USERS, users);

  const user: User = {
    uid,
    email,
    displayName: `${userData.name} ${userData.surname}`,
  };
  await writeJson(KEY_AUTH, user);
  notifyAuthChange(user);
  return user;
};

// Login with email + password
export const loginUser = async (
  email: string,
  password: string,
): Promise<User> => {
  const users = await readJson<Record<string, StoredUserRecord>>(KEY_USERS, {});
  const found = Object.values(users).find(
    (u) => u.email === email && u.password === password,
  );
  if (!found) throw new Error("Invalid email or password");

  const user: User = {
    uid: found.uid,
    email: found.email,
    displayName: `${found.profile.name} ${found.profile.surname}`,
  };
  await writeJson(KEY_AUTH, user);
  notifyAuthChange(user);
  return user;
};

export const logoutUser = async (): Promise<void> => {
  await AsyncStorage.removeItem(KEY_AUTH);
  notifyAuthChange(null);
};

export const getUserProfile = async (
  uid: string,
): Promise<UserProfile | null> => {
  const users = await readJson<Record<string, StoredUserRecord>>(KEY_USERS, {});
  const found = users[uid];
  return found ? found.profile : null;
};

export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>,
): Promise<boolean> => {
  const users = await readJson<Record<string, StoredUserRecord>>(KEY_USERS, {});
  const found = users[uid];
  if (!found) return false;

  found.profile = {
    ...found.profile,
    ...updates,
    updatedAt: Date.now(),
  };

  users[uid] = found;
  await writeJson(KEY_USERS, users);
  return true;
};

export const getCurrentUser = async (): Promise<User | null> => {
  return readJson<User | null>(KEY_AUTH, null);
};

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  authListeners.push(callback);
  // Immediately call with current user
  readJson<User | null>(KEY_AUTH, null).then((u) => callback(u));
  return () => {
    authListeners = authListeners.filter((cb) => cb !== callback);
  };
};

// Export storage keys for other services that need them
export const _storageKeys = {
  KEY_USERS,
  KEY_AUTH,
  KEY_ORDERS,
  KEY_FOODS,
};
