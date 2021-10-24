import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";

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
    // Handle Errors here.
    // const errorCode = error.code;
    // const errorMessage = error.message;
    // // The email of the user's account used.
    // const email = error.email;
    // // The AuthCredential type that was used.
    // const credential = GithubAuthProvider.credentialFromError(error);
  }
};

export { signInWithGithub };
