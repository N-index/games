import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyBEHF5kHaUexdPC4FJbSjQY5xR7LXz5aS0",
  authDomain: "games-2a669.firebaseapp.com",
  projectId: "games-2a669",
  storageBucket: "games-2a669.appspot.com",
  messagingSenderId: "925825691127",
  appId: "1:925825691127:web:1e49a83b32c82563f292f2",
};
export const initFirebaseApp = () => {
  return initializeApp(firebaseConfig);
};
