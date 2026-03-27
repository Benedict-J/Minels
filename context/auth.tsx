import { User, createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, firebaseConfigError } from "@/firebase/init-firebase";

interface IAuthContext {
  currentUser: User | null
  login: any,
  logout: any,
  registerWithEmail: any,
  forgotPassword: any,
  authError: string | null,
}

export const AuthContext = createContext<IAuthContext>({
  currentUser: null,
  login: () => null,
  logout: () => null,
  registerWithEmail: () => null,
  forgotPassword: () => null,
  authError: null,
});

export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getMissingConfigError = () =>
    Promise.reject(new Error(firebaseConfigError || "Firebase is not configured."));

  const registerWithEmail = ({ email, password}: any) =>
    auth ? createUserWithEmailAndPassword(auth, email, password) : getMissingConfigError();

  const login = ({ email, password }: any) =>
    auth ? signInWithEmailAndPassword(auth, email, password) : getMissingConfigError();

  const logout = () => {
    setCurrentUser(null)
    if (!auth) return;
    signOut(auth)
    window.location.href = "/"
  };

  const forgotPassword = (email: string) =>
    auth ? sendPasswordResetEmail(auth, email) : getMissingConfigError();
  
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    })

    return unsubscribe;
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, registerWithEmail, forgotPassword, authError: firebaseConfigError }}>
      {loading? null : children}
    </AuthContext.Provider>
  )
}
