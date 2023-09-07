import { collection, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { auth, db } from "../init-firebase";

export const loadProducts = async ({
  search = "",
  size = 10,
  start = null
}) => {
  const user = auth.currentUser;

  if (!user) {
    return {
      data: [],
      next: null,
      count: 0
    };
  }

  const productCollection = collection(db, "products");
  search = search.toLowerCase();
  let q = query(
    productCollection,
    where("author", "==", user.uid),
    where("name_lower", ">=", search),
    where("name_lower", "<=", search + "\uf8ff"),
    orderBy("name_lower"),
    limit(size),
  );
  if (start) {
    q = query(q, startAfter(start));
  }

  const querySnapshot = await getDocs(q);
  const countSnapshot = await getCountFromServer(q);
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

  return {
    data: querySnapshot.docs.map((doc, index) => {
      const data = doc.data();
      data.id = doc.id;
      data.key = index;
      return data;
    }),
    next: lastVisible,
    count: countSnapshot.data().count,
  };
}

export const getProduct = async (id: string) => {
  const user = auth.currentUser;

  if (!user) {
    return;
  }

  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let product = docSnap.data();
    product.id = docSnap.id;

    return product;
  } else {
  }
}