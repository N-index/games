import { getFirestore } from "firebase/firestore";
import { initFirebaseApp } from "./init";

const firebaseApp = initFirebaseApp();

export const db = getFirestore(firebaseApp);
