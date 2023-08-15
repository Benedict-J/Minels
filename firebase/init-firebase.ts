import "firebase/firestore";

import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  getDocs, 
  collection,
  setDoc,
  doc,
  addDoc
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const loadProducts = async () => {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map((doc, index) => {
    const data = doc.data();
    data.id = doc.id;
    data.key = index;
    return data;
  });
}

export const createProduct = async (values: any) => {
  if (values.id) {
    await setDoc(doc(db, "products", values.id), values);
  } else {
    await addDoc(collection(db, "products"), {
      name: values.name,
      quantity: values.quantity || 0,
      price: values.price || 0
    });
  }
}
