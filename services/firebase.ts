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
  getFirestore,
  setDoc,
  updateDoc,
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

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.warn(
      "Multiple tabs open, persistence can only be enabled in one tab at a time.",
    );
  } else if (err.code === "unimplemented") {
    console.warn("The current browser does not support offline persistence");
  }
});

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

    try {
      await setDoc(doc(db, "users", user.uid), userProfile);
    } catch (firestoreError) {
      console.warn("Failed to save user profile to Firestore:", firestoreError);
      // Continue anyway - the user is created in Auth
    }

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
    console.warn("Error fetching user profile:", error.message);
    // Return null instead of throwing to allow login to proceed
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>,
): Promise<void> => {
  try {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Date.now(),
    });
  } catch (error: any) {
    console.warn("Error updating user profile:", error.message);
    // Don't throw - allow the app to continue
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
