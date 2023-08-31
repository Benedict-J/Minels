import { User, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "@/firebase/init-firebase";

interface IAuthContext {
  currentUser: User | null
  setCurrentUser: any
}

export const AuthContext = createContext<IAuthContext>({
  currentUser: null,
  setCurrentUser: () => null
});

export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  )
}