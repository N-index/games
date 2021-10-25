import {
  doc,
  addDoc,
  collection,
  getDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./db";

import { getAuth } from "firebase/auth";

async function addRate(gameKey, score) {
  const col = collection(db, `rates/${gameKey}/records`);
  const currentUser = getAuth().currentUser;
  const userRef = doc(db, "users", currentUser.uid);
  await addDoc(col, {
    user: userRef,
    rate_value: score,
    rate_time: Timestamp.fromDate(new Date()),
  });
}
async function addScore(gameKey, score) {
  const col = collection(db, `scores/${gameKey}/records`);
  const currentUser = getAuth().currentUser;
  const userRef = doc(db, "users", currentUser.uid);
  await addDoc(col, {
    user: userRef,
    score: score,
    add_time: Timestamp.fromDate(new Date()),
  });
}

async function getUser(path) {
  const userRef = doc(db, path);
  const user = await getDoc(userRef);
  if (user.exists()) {
    return user.data();
  } else {
    return false;
  }
}

async function getScore(gameKey) {
  const col = collection(db, `scores/${gameKey}/records`);
  const q = query(col, orderBy("score", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());
}
export { addRate, addScore, getScore, getUser };

// 获取 collection 的所有数据
// const ratesDocs = await getDocs(rateCollections);
// return ratesDocs.docs.map(doc => doc.data());
