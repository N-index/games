import { initFirebaseApp } from "./init";
import {
  getAuth,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
} from "firebase/auth";

initFirebaseApp();

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
