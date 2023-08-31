import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "@/firebase/init-firebase";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface IAuthContext {
  currentUser: User | null
  login: any,
  logout: any,
}

export const AuthContext = createContext<IAuthContext>({
  currentUser: null,
  login: () => null,
  logout: () => null,
});

export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = ({ email, password }: any) => signInWithEmailAndPassword(auth, email, password);

  const logout = () => {
    setCurrentUser(null)
    signOut(auth)
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    })

    return unsubscribe;
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {loading? null : children}
    </AuthContext.Provider>
  )
}