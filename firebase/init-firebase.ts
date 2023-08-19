import "firebase/firestore";

import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  getDocs, 
  collection,
  setDoc,
  doc,
  addDoc,
  getDoc,
  deleteDoc,
  getCountFromServer,
  where,
  query,
  startAt,
  limit,
  orderBy
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

export const loadProducts = async (
  search: string = "", 
  size: number = 10,
  start: string | null = null,
) => {
  const productCol = collection(db, "products");

  search = search.toLowerCase();

  const q = query(productCol, 
    where("name_lower", ">=", search), 
    where("name_lower", "<=", search + "\uf8ff"),
    orderBy("name_lower"),
    startAt(start),
    limit(size)
  );

  const querySnapshot = await getDocs(q);
  const countSnapshot = await getCountFromServer(productCol);
  const lastVisible = querySnapshot.docs[querySnapshot.size - 1];
  
  return {
    data: querySnapshot.docs.map((doc, index) => {
      const data = doc.data();
      data.id = doc.id;
      data.key = index;
      return data;
    }),
    next: lastVisible,
    count: countSnapshot.data().count
  }
}

export const getProduct = async (id: string) => {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let product = docSnap.data();
    product.id = docSnap.id;
    
    return product;
  } else {
    
  }
}

export const createProduct = async (values: any) => {
  if (values.id) {
    await setDoc(doc(db, "products", values.id), values);
  } else {
    await addDoc(collection(db, "products"), {
      name: values.name,
      name_lower: values.name.toLowerCase(),
      quantity: values.quantity || 0,
      price: values.price || 0
    });
  }
}

export const deleteProduct = async (id: string) => {
  await deleteDoc(doc(db, "products", id));
}
