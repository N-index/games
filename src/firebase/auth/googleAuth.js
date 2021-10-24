import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
const auth = getAuth();
const provider = new GoogleAuthProvider();

// github 使用的是 popup, 那么 Google 就使用 redirect 吧。

const signInWithGoogle = () => {
  localStorage.setItem("waitingGoogleDirect", JSON.stringify(true));
  signInWithRedirect(auth, provider);
};

const getGoogleRedirectResult = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await getRedirectResult(auth);
    // This gives you a Google Access Token. You can use it to access Google APIs.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    return { result, credential, user };
  } catch (e) {
    throw e;
  }

  // Handle Errors here.
  // const errorCode = error.code;
  // const errorMessage = error.message;
  // // The email of the user's account used.
  // const email = error.email;
  // // The AuthCredential type that was used.
  // const credential = GoogleAuthProvider.credentialFromError(error);
  // // ...
};

export { signInWithGoogle, getGoogleRedirectResult };
