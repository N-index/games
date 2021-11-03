import {
  getAuth,
  signInWithPopup,
  GithubAuthProvider,
  getRedirectResult,
} from "firebase/auth";

const auth = getAuth();

const provider = new GithubAuthProvider();

const signInWithGithub = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await signInWithPopup(auth, provider);
    return {
      result,
      credential: GithubAuthProvider.credentialFromResult(result),
    };
  } catch (e) {
    throw e;
    // const email = error.email;
    // // The AuthCredential type that was used.
    // const credential = GithubAuthProvider.credentialFromError(error);
  }
};

const getGithubRedirectResult = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await getRedirectResult(auth);
    // This gives you a Google Access Token. You can use it to access Google APIs.
    const credential = GithubAuthProvider.credentialFromResult(result);
    console.log("github 重定向回来");
    const user = result.user;
    console.log(credential);
    console.log(result);
    return { result, credential, user };
  } catch (e) {
    throw e;
  }
};

export { signInWithGithub, getGithubRedirectResult };
