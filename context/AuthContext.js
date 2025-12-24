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
  // In the future, you will call this from SettingsPage handleSave()
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
      {loading ? (
        // Optional: A nice loading spinner while checking auth status
        <div className="h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d17600]"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
