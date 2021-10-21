import {
  addDoc,
  collection,
  getDocs,
  query,
  // where,
  orderBy,
} from "firebase/firestore/lite";
import { db } from "./index";
// import {  } from "firebase/firebase-firestore";
const rateCollections = collection(db, "rate");
// const snakeScoreCollection = collection(db, "snakeScore");
// const needleScoreCollection = collection(db, "needleScore");
// const squareScoreCollection = collection(db, "squareScore");

function getRandomIntBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomFloatBetween(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}
function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

async function addRate(gameName, score = getRandomFloatBetween(0, 5)) {
  await addDoc(rateCollections, {
    game_name: gameName,
    user_id: getRandomIntBetween(2, 5000),
    score: score,
    vote_time: randomDate(new Date(2012, 0, 1), new Date()),
  });
}

async function addScore(gameKey, score) {
  const col = collection(db, gameKey + "Score");
  await addDoc(col, {
    user_id: getRandomIntBetween(2, 5000),
    score: score,
    add_time: new Date(),
    // add_time: randomDate(new Date(2012, 0, 1), new Date()),
  });
}

async function getScore(gameKey) {
  // const q = query(rateCollections,where('game_name','==',gameName));
  // const q = query(rateCollections, where("game_name", "==", gameName));

  const col = collection(db, gameKey + "Score");
  const q = query(col, orderBy("score", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());

  // 获取 collection 的所有数据
  // const ratesDocs = await getDocs(rateCollections);
  // return ratesDocs.docs.map(doc => doc.data());
}
export { addRate, addScore, getScore };
