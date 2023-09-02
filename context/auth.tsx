import { User, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "@/firebase/init-firebase";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface IAuthContext {
  currentUser: User | null
  login: any,
  logout: any,
  registerWithEmail: any
}

export const AuthContext = createContext<IAuthContext>({
  currentUser: null,
  login: () => null,
  logout: () => null,
  registerWithEmail: () => null
});

export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const registerWithEmail = ({ email, password}: any) => createUserWithEmailAndPassword(auth, email, password);

  const login = ({ email, password }: any) => signInWithEmailAndPassword(auth, email, password);

  const logout = () => {
    setCurrentUser(null)
    signOut(auth)
    window.location.href = "/"
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    })

    return unsubscribe;
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, registerWithEmail }}>
      {loading? null : children}
    </AuthContext.Provider>
  )
}