import { auth } from "../init-firebase";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

export const signIn = ({ email, password } : { email: any, password: any }) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
    })
    .catch((error) => {
      
    })
}
