import { initFirebaseApp } from "../init";
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

const emailLinkAuth = getAuth();

const sendEmail = async (email) => {
  // eslint-disable-next-line no-useless-catch
  try {
    await sendSignInLinkToEmail(emailLinkAuth, email, actionCodeSettings);
  } catch (e) {
    throw e;
  }
};

const isSignInLink = () => {
  return isSignInWithEmailLink(emailLinkAuth, window.location.href);
};

const signInWithEmail = async (email) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await signInWithEmailLink(
      emailLinkAuth,
      email,
      window.location.href
    );
    window.localStorage.removeItem("emailForSignIn");
    return result;
  } catch (e) {
    throw e;
  }
};

export {
  emailLinkAuth,
  onAuthStateChanged,
  sendEmail,
  isSignInLink,
  signInWithEmail,
  signOut,
};
