import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import {
  doc,
  enableIndexedDbPersistence,
  getDoc,
  getDocFromCache,
  getFirestore,
  setDoc,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRDKvW53eWpWFypuip5fQ6wWCtF_tb_pM",
  authDomain: "foodhub-fe8b2.firebaseapp.com",
  projectId: "foodhub-fe8b2",
  storageBucket: "foodhub-fe8b2.firebasestorage.app",
  messagingSenderId: "655381628782",
  appId: "1:655381628782:web:0c211d4ed950ea83d2e37f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence (only in browser environments that support IndexedDB)
if (
  typeof window !== "undefined" &&
  typeof (window as any).indexedDB !== "undefined"
) {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === "failed-precondition") {
      console.warn(
        "Multiple tabs open, persistence can only be enabled in one tab at a time.",
      );
    } else if (err.code === "unimplemented") {
      console.warn("The current browser does not support offline persistence");
    }
  });
} else {
  // Not a browser or IndexedDB unavailable (e.g., native platforms) — skip enabling persistence.
}

// User profile type
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

// Register user with email and password
export const registerUser = async (
  email: string,
  password: string,
  userData: Omit<UserProfile, "uid" | "createdAt" | "updatedAt" | "email">,
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Update Firebase auth profile
    await updateProfile(user, {
      displayName: `${userData.name} ${userData.surname}`,
    });

    // Store user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || email,
      ...userData,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await setDoc(doc(db, "users", user.uid), userProfile);

    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Login user with email and password
export const loginUser = async (
  email: string,
  password: string,
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get user profile from Firestore
export const getUserProfile = async (
  uid: string,
): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
  } catch (error: any) {
    // If Firestore thinks the client is offline, try to read from cache as a fallback.
    if (
      error &&
      typeof error.message === "string" &&
      error.message.toLowerCase().includes("client is offline")
    ) {
      try {
        const docRef = doc(db, "users", uid);
        const cachedSnap = await getDocFromCache(docRef);
        return cachedSnap.exists() ? (cachedSnap.data() as UserProfile) : null;
      } catch {
        // Can't read from cache (likely unsupported in this environment) — return null quietly.
        return null;
      }
    }

    // Handle permission errors more gracefully: return null instead of throwing
    // so callers can proceed (e.g., show login or limited UI) without crashing.
    const msg = error?.message || "";
    const code = error?.code || "";
    if (
      msg.toLowerCase().includes("missing or insufficient permissions") ||
      msg.toLowerCase().includes("permission-denied") ||
      code === "permission-denied"
    ) {
      console.warn(
        "Firestore permission denied when reading user profile:",
        error,
      );
      return null;
    }

    throw new Error(msg);
  }
};

// Update user profile
export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>,
): Promise<boolean> => {
  try {
    const docRef = doc(db, "users", uid);
    // Use setDoc with merge to create the document if it doesn't exist
    // and update the provided fields atomically.
    await setDoc(
      docRef,
      {
        ...updates,
        updatedAt: Date.now(),
      },
      { merge: true },
    );

    return true;
  } catch (error: any) {
    const msg = error?.message || "";
    const code = error?.code || "";

    if (
      msg.toLowerCase().includes("missing or insufficient permissions") ||
      msg.toLowerCase().includes("permission-denied") ||
      code === "permission-denied"
    ) {
      console.warn(
        "Firestore permission denied when updating user profile:",
        error,
      );
      return false;
    }

    throw new Error(msg);
  }
};

// Get current authenticated user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Subscribe to auth state changes
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return auth.onAuthStateChanged(callback);
};
