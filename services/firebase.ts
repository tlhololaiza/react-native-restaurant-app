import { auth, firestore } from "@/services/firebaseClient";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// AsyncStorage keys kept for services that still use AsyncStorage (e.g. orderService)
const KEY_USERS = "@foodhub:users";
const KEY_AUTH = "@foodhub:auth";
const KEY_ORDERS = "@foodhub:orders";
const KEY_FOODS = "@foodhub:foods";

// Minimal user type used throughout the app
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

const toUser = (fbUser: {
  uid: string;
  email: string | null;
  displayName: string | null;
}): User => ({
  uid: fbUser.uid,
  email: fbUser.email,
  displayName: fbUser.displayName,
});

// Register a new user with Firebase Auth and store the profile in Firestore
export const registerUser = async (
  email: string,
  password: string,
  userData: Omit<UserProfile, "uid" | "createdAt" | "updatedAt" | "email">,
): Promise<User> => {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const fbUser = credential.user;

  await updateProfile(fbUser, {
    displayName: `${userData.name} ${userData.surname}`,
  });

  const profile: UserProfile = {
    uid: fbUser.uid,
    email,
    ...userData,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await setDoc(doc(firestore, "users", fbUser.uid), profile);

  return toUser(fbUser);
};

// Login with Firebase Auth
export const loginUser = async (
  email: string,
  password: string,
): Promise<User> => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return toUser(credential.user);
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const getUserProfile = async (
  uid: string,
): Promise<UserProfile | null> => {
  const snap = await getDoc(doc(firestore, "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
};

export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>,
): Promise<boolean> => {
  try {
    await updateDoc(doc(firestore, "users", uid), {
      ...updates,
      updatedAt: Date.now(),
    });
    return true;
  } catch {
    return false;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const fbUser = auth.currentUser;
  return fbUser ? toUser(fbUser) : null;
};

export const onAuthStateChanged = (
  callback: (user: User | null) => void,
): (() => void) => {
  return firebaseOnAuthStateChanged(auth, (fbUser) => {
    callback(fbUser ? toUser(fbUser) : null);
  });
};

// Export storage keys for other services that need them (e.g. orderService)
export const _storageKeys = {
  KEY_USERS,
  KEY_AUTH,
  KEY_ORDERS,
  KEY_FOODS,
};
