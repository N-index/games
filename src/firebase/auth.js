import {
  getAuth,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
} from "firebase/auth";

import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyBEHF5kHaUexdPC4FJbSjQY5xR7LXz5aS0",
  authDomain: "games-2a669.firebaseapp.com",
  projectId: "games-2a669",
  storageBucket: "games-2a669.appspot.com",
  messagingSenderId: "925825691127",
  appId: "1:925825691127:web:1e49a83b32c82563f292f2",
};
// const app = initializeApp(firebaseConfig);
initializeApp(firebaseConfig);
const actionCodeSettings = {
  url: process.env["VUE_APP_REDIRECT_URL"] || "http://localhost",
  handleCodeInApp: true,
};

const auth = getAuth();

const sendEmail = async (email) => {
  // eslint-disable-next-line no-useless-catch
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  } catch (e) {
    throw e;
  }
};

const isSignInLink = () => {
  return isSignInWithEmailLink(auth, window.location.href);
};

const signIn = async (email) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await signInWithEmailLink(auth, email, window.location.href);
    window.localStorage.removeItem("emailForSignIn");
    return result;
  } catch (e) {
    throw e;
  }
};

export { auth, onAuthStateChanged, sendEmail, isSignInLink, signIn, signOut };
