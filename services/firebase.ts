import { initializeApp } from 'firebase/app';
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User,
} from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBRDKvW53eWpWFypuip5fQ6wWCtF_tb_pM',
  authDomain: 'foodhub-fe8b2.firebaseapp.com',
  projectId: 'foodhub-fe8b2',
  storageBucket: 'foodhub-fe8b2.firebasestorage.app',
  messagingSenderId: '655381628782',
  appId: '1:655381628782:web:0c211d4ed950ea83d2e37f',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

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
  userData: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt' | 'email'>
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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

    await setDoc(doc(db, 'users', user.uid), userProfile);

    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Login user with email and password
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Update user profile
export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Date.now(),
    });
  } catch (error: any) {
    throw new Error(error.message);
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
