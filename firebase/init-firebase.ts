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
  orderBy,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  writeBatch,
  runTransaction
} from "firebase/firestore";

import moment from "moment";

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
  start: QueryDocumentSnapshot<DocumentData, DocumentData> | null = null,
) => {
  const productCol = collection(db, "products");

  search = search.toLowerCase();

  let q = query(productCol, 
    where("name_lower", ">=", search), 
    where("name_lower", "<=", search + "\uf8ff"),
    orderBy("name_lower"),
    limit(size)
  );

  if (start) {
    q = query(q, startAfter(start));
  }

  const querySnapshot = await getDocs(q);
  const countSnapshot = await getCountFromServer(productCol);
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    
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

export const loadOrders = async (
  search: string = "", 
  size: number = 10,
  start: QueryDocumentSnapshot<DocumentData, DocumentData> | null = null,
) => {
  const productCol = collection(db, "orders");

  search = search.toLowerCase();

  let q = query(productCol, 
    // where("id", ">=", search), 
    // where("id", "<=", search + "\uf8ff"),
    // orderBy("id"),
    limit(size)
  );

  if (start) {
    q = query(q, startAfter(start));
  }

  const querySnapshot = await getDocs(q);
  const countSnapshot = await getCountFromServer(productCol);
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    
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

export const createOrder = async (values: any) => {
  await addDoc(collection(db, "orders"), {
    items: values.items,
    created_at: moment().endOf('day').valueOf()
  })

  values.items.map(async (item: any) => {
    await runTransaction(db, async (transaction) => {
      const ref = doc(db, "products", item.id);
      const itemDoc = await transaction.get(ref);
      if (!itemDoc.exists()) {
        throw "Document does not exists!";
      }

      const newQuantity = itemDoc.data().quantity - item.quantity;
      transaction.update(ref, { quantity: newQuantity });
    })
  })
}

// Dashboard APIs

export const generateTotalRevenue = async () => {
  const ordersCollection = collection(db, "orders");

  // const currentDate = moment()
  // const prevMonthDate = currentDate.subtract(1, 'months')

  // let q = query(orderCollection, where('created_at', '<=', currentDate.))
}