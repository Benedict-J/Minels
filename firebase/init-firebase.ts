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
  limit,
  orderBy,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  runTransaction,
  updateDoc,
} from "firebase/firestore";

import moment from "moment";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


export const loadProducts = async (
  filter: any = {},
  size: number = 10,
  start: QueryDocumentSnapshot<DocumentData, DocumentData> | null = null,
) => {
  const user = auth.currentUser;

  if (!user) {
    return {
      data: [],
      next: null,
      count: 0
    };
  }
  
  const productCol = collection(db, "products");
  let search = "";

  if (Object.keys(filter).includes('search')) {
    search = filter.search;
    search = search.toLowerCase();
  }

  let q = query(
    productCol,
    where("author", "==", user.uid),
    // where("name_lower", ">=", search),
    // where("name_lower", "<=", search + "\uf8ff"),
    orderBy("name_lower"),
    // limit(size),
  );

  if (start) {
    q = query(q, startAfter(start));
  }

  const querySnapshot = await getDocs(q);
  const countSnapshot = await getCountFromServer(q);
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

  // console.log(querySnapshot.docs)

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
};

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
};

export const createProduct = async (values: any) => {
  const user = auth.currentUser;

  if (!user) {
    return;
  }

  if (values.id) {
    await updateDoc(doc(db, "products", values.id), values);
  } else {
    await addDoc(collection(db, "products"), {
      name: values.name,
      name_lower: values.name.toLowerCase(),
      quantity: values.quantity || 0,
      sell_price: values.sell_price || 0,
      buy_price: values.buy_price || 0,
      sold: 0,
      author: user.uid
    });
  }
};

export const deleteProduct = async (id: string) => {
  await deleteDoc(doc(db, "products", id));
};

export const loadOrders = async (
  filter: any = {},
  size: number = 10,
  start: QueryDocumentSnapshot<DocumentData, DocumentData> | null = null,
) => {
  const user = auth.currentUser;

  if (!user) {
    return {
      data: [],
      next: null,
      count: 0
    };
  }

  const ordersCollection = collection(db, "orders");

  let q = query(
    ordersCollection,
    where("status", "in", ["UNPAID", "PAID"].filter(el => el !== filter.status)),
    where('author', '==', user.uid),
    limit(size),
  );

  if (filter.customer) {
    q = query(q, where('customer.id', '==', filter.customer || ''))
  }

  if (start) {
    q = query(q, startAfter(start));
  }

  const querySnapshot = await getDocs(q);
  const countSnapshot = await getCountFromServer(ordersCollection);
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
};

export const getOrder = async (id: string) => {
  const user = auth.currentUser;
  if (!user) return {};
  
  const docRef = doc(db, "orders", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let order = docSnap.data();
    order.id = docSnap.id;

    return order;
  } else {
  }
}

export const createOrder = async (values: any) => {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, "orders"), {
    total: values.total,
    status: values.status,
    customer: values.customer,
    items: values.items,
    author: user.uid,
    created_at: moment().valueOf(),
  });

  values.items.map(async (item: any) => {
    await runTransaction(db, async (transaction) => {
      const ref = doc(db, "products", item.id);
      const itemDoc = await transaction.get(ref);
      if (!itemDoc.exists()) {
        throw "Document does not exists!";
      }

      const newQuantity = itemDoc.data().quantity - item.quantity;
      const newSold = itemDoc.data().sold + item.quantity;
      transaction.update(ref, { quantity: newQuantity, sold: newSold });
    });
  });

  if (values.status === "UNPAID") {
    await runTransaction(db, async (transaction) => {
      const ref = doc(db, "customers", values.customer.id);
      const customerDoc = await transaction.get(ref);

      if (!customerDoc.exists()) {
        throw "Document does not exists!";
      }
      
      const newDebt = customerDoc.data().debt + values.total;
      transaction.update(ref, { debt: newDebt }); 
    })
  }
};

export const deleteCustomer = async (id: string) => {
  await deleteDoc(doc(db, "customers", id))
}

export const updateOrderStatus = async (id: string, status: string) => {
  const user = auth.currentUser;
  if (!user) return;

  await updateDoc(doc(db, "orders", id), {
    status: status
  })
}

export const loadCustomers = async (
  filter: any = {},
  size: number = 10,
  start: QueryDocumentSnapshot<DocumentData, DocumentData> | null = null,
) => {
  const user = auth.currentUser;

  if (!user) {
    return {
      data: [],
      next: null,
      count: 0
    };
  }

  const customersCollection = collection(db, "customers");
  let search = "";
  if (Object.keys(filter).includes('search')) {
    search = filter.search;
    search = search.toLowerCase();
  }

  let q = query(
    customersCollection,
    where("author", "==", user.uid),
    where("name_lower", ">=", search),
    where("name_lower", "<=", search + "\uf8ff"),
    orderBy("name_lower"),
    limit(size)
  )

  if (start) {
    q = query(q, startAfter(start));
  }

  const querySnapshot = await getDocs(q);
  const countSnapshot = await getCountFromServer(customersCollection);
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
  }
}

export const createCustomer = async (values: any) => {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, "customers"), {
    name: values.name,
    name_lower: values.name.toLowerCase(),
    debt: values.debt,
    author: user.uid
  });
}

// Dashboard APIs

export const generateTotalRevenue = async () => {
  const user = auth.currentUser;
  if (!user) return 0;

  const ordersCollection = collection(db, "orders");

  const currentDate = moment().endOf("D").valueOf();
  const prevMonthDate = moment().subtract(1, "months");

  let q = query(
    ordersCollection,
    where("author", "==", user.uid),
    where("created_at", ">=", prevMonthDate.valueOf()),
    where("created_at", "<=", currentDate.valueOf()),
  );

  const querySnapshot = await getDocs(q);

  const total = querySnapshot.docs.reduce(
    (acc, current) => acc + current.data().total,
    0,
  );

  return total;
};

export const generateTotalSales = async () => {
  const user = auth.currentUser;
  if (!user) return 0;

  const ordersCollection = collection(db, "orders");

  const currentDate = moment().endOf("D").valueOf();
  const prevMonthDate = moment().subtract(1, "months");

  let q = query(
    ordersCollection,
    where("author", "==", user.uid),
    where("created_at", ">=", prevMonthDate.valueOf()),
    where("created_at", "<=", currentDate.valueOf()),
  );

  const querySnapshot = await getDocs(q);

  const total = querySnapshot.docs.reduce(
    (acc, current) =>
      acc +
      current
        .data()
        .items.reduce(
          (acc: any, item: { quantity: any }) => acc + item.quantity,
          0,
        ),
    0,
  );

  return total;
};

export const getPopularItems = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  const productsCollection = collection(db, "products");

  const q = query(productsCollection, 
    where("author", "==", user.uid), 
    where("sold", ">", 0));

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc, index) => {
    const data = doc.data();

    return data;
  });
};

export const generateTotalProfit = async () => {
  const user = auth.currentUser;
  if (!user) return 0;

  const ordersCollection = collection(db, "orders");

  const currentDate = moment().endOf("D").valueOf();
  const prevMonthDate = moment().subtract(1, "months");

  let q = query(
    ordersCollection,
    where("author", "==", user.uid),
    where("created_at", ">=", prevMonthDate.valueOf()),
    where("created_at", "<=", currentDate.valueOf()),
  );

  const querySnapshot = await getDocs(q);

  const profit = querySnapshot.docs.reduce(
    (acc, current) =>{
      const data = current.data();

      return acc + data.items.reduce((acc: number, item: { sell_price: number; quantity: number; buy_price: number; }) => {
        return acc + (item.sell_price) - (item.buy_price * item.quantity);
      }, 0)
    }, 0
  )

  return profit;
}

export const generateRevenueStatistics = async () => {
  const user = auth.currentUser;
  if (!user) return [0, 0];

  const ordersCollection = collection(db, "orders");

  const currentDate = moment().endOf("D").valueOf();
  const prevMonthDate = moment().subtract(1, "months");

  let q = query(
    ordersCollection,
    where("author", "==", user.uid),
    where("created_at", ">=", prevMonthDate.valueOf()),
    where("created_at", "<=", currentDate.valueOf()),
  );

  const querySnapshot = await getDocs(q);
  let unpaidRevenue = 0;
  let paidRevenue = 0;

  let data: any = querySnapshot.docs.map((doc) => doc.data());

  for (let i = 0; i < data.length; i++) {
    if (data[i].status === "UNPAID") {
      unpaidRevenue += data[i].total;
      // console.log(data[i].total)
    } else if (data[i].status === "PAID") {
      paidRevenue += data[i].total;
    }
  }

  return [unpaidRevenue, paidRevenue];
}

export const generateSalesAnalytics = async () => {
  const user = auth.currentUser;
  if (!user) return [0, 0, 0, 0];

  const ordersCollection = collection(db, "orders");

  const currentDate = moment().endOf("D").valueOf();
  const prevMonthDate = moment().subtract(1, "months");

  let q = query(
    ordersCollection,
    where("author", "==", user.uid),
    where("created_at", ">=", prevMonthDate.valueOf()),
    where("created_at", "<=", currentDate.valueOf()),
    orderBy('created_at')
  );

  const querySnapshot = await getDocs(q);
  const data: any = querySnapshot.docs.map(doc => doc.data());

  let week1 = 0, week2 = 0, week3 = 0, week4 = 0;
  
  const endOfFirstWeek = moment().subtract(3, 'weeks')
  const endOfSecondWeek = moment().subtract(2, 'weeks')
  const endOfThirdWeek = moment().subtract(1, 'weeks')
  const endOfFourthWeek = moment()

  for (let i = 0; i < data.length; i++) {
    const dataMoment = moment(data[i].created_at);

    if (endOfFirstWeek.diff(dataMoment) > 0) {
      week1 += data[i].total;
    } else if (endOfSecondWeek.diff(dataMoment) > 0) {
      week2 += data[i].total;
    } else if (endOfThirdWeek.diff(dataMoment) > 0) {
      week3 += data[i].total;
    } else if (endOfFourthWeek.diff(dataMoment) > 0) {
      week4 += data[i].total;
    }
  }

  return [week1, week2, week3, week4];
}

export const getHighestDebts = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  const customersCollection = collection(db, "customers");

  let q = query(
    customersCollection,
    where("author", "==", user.uid),
    limit(5),
    orderBy('debt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  const data: any = querySnapshot.docs.map(doc => {
    const data = doc.data();

    return {
      name: data.name,
      debt: data.debt
    }
  });

  return data;
}