import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
const auth = getAuth();
const provider = new GoogleAuthProvider();

// github 使用的是 popup, 那么 Google 就使用 redirect 吧。

const signInWithGoogle = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    localStorage.setItem("waitingGoogleDirect", JSON.stringify(true));
    signInWithRedirect(auth, provider);
  }
};

const getGoogleRedirectResult = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await getRedirectResult(auth);
    // This gives you a Google Access Token. You can use it to access Google APIs.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    console.log("google 重定向回来");
    const user = result.user;
    console.log(credential);
    console.log(result);
    return { result, credential, user };
  } catch (e) {
    throw e;
  }
};

export { signInWithGoogle, getGoogleRedirectResult };
