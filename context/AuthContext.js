"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut,
    updateProfile 
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; 
import { auth, db } from "@/lib/firebase"; 
import { useRouter } from "next/navigation";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Listener: Detects login/logout & extracts profile data + ROLE
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
            // Strict Check: Fetch the user's role from the 'users' collection
            // We do NOT default to 'admin' anymore. Default is null (Visitor).
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            
            if (userDocSnap.exists()) {
                const data = userDocSnap.data();
                
                // CRITICAL: Check if account is active
                if (data.active === false) {
                    await signOut(auth);
                    setUser(null);
                    setLoading(false);
                    return; 
                }

                setUser({
                  uid: currentUser.uid,
                  email: currentUser.email,
                  displayName: data.displayName || currentUser.displayName || "Admin",
                  photoURL: data.photoURL || currentUser.photoURL || null,
                  role: data.role || null, // Only set role if it exists in DB
                });
            } else {
                // User exists in Auth but not in DB (Unauthorized)
                setUser({
                    uid: currentUser.uid,
                    email: currentUser.email,
                    role: null 
                });
            }
        } catch (error) {
            console.error("Error fetching user role:", error);
            setUser(null);
        }
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

  // Update Profile Function
  const updateUserProfile = async (data) => {
    if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
            displayName: data.displayName,
            photoURL: data.photoURL
        });
        setUser((prev) => ({
            ...prev,
            displayName: data.displayName,
            photoURL: data.photoURL
        }));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};