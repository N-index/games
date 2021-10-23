import { getFirestore } from "firebase/firestore/lite";
import { firebaseApp } from "../main";

export const db = getFirestore(firebaseApp);
