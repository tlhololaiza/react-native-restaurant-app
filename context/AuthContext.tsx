import { getUserProfile, onAuthStateChanged } from "@/services/firebase";
import { useAuthStore } from "@/utils/authStore";
import React, { useEffect } from "react";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setUser, setUserProfile } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        try {
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setUserProfile(profile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, [setUser, setUserProfile]);

  return <>{children}</>;
};
