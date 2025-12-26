"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut,
    updateProfile 
} from "firebase/auth";
import { auth } from "@/lib/firebase"; 
import { useRouter } from "next/navigation";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Listener: Detects login/logout & extracts profile data
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || "Admin User", // Fallback name
          photoURL: currentUser.photoURL || null,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login Function
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout Function
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    router.push("/admin/login");
  };

  // Update Profile Function (For Settings Page)
  const updateUserProfile = async (data) => {
    if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
            displayName: data.displayName,
            photoURL: data.photoURL
        });
        // Manually update local state to reflect changes immediately
        setUser((prev) => ({
            ...prev,
            displayName: data.displayName,
            photoURL: data.photoURL
        }));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserProfile, loading }}>
      {/* FIX: We removed the loading spinner block here. 
          Now the app renders immediately, allowing the Splash Screen 
          on the Home Page to take over.
      */}
      {children}
    </AuthContext.Provider>
  );
};
