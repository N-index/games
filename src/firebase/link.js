import {
  EmailAuthProvider,
  GoogleAuthProvider,
  GithubAuthProvider,
  getAuth,
  linkWithCredential,
  linkWithRedirect,
  unlink,
} from "firebase/auth";

const auth = getAuth();

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

async function linkWithEmailPassword(email, password) {
  const credential = EmailAuthProvider.credential(email, password);
  // eslint-disable-next-line no-useless-catch
  try {
    const res = await linkWithCredential(auth.currentUser, credential);
    console.log(res);
  } catch (e) {
    throw e;
  }
}

async function linkGoogleWithRedirect() {
  const curUser = auth.currentUser;
  // eslint-disable-next-line no-useless-catch
  try {
    linkWithRedirect(curUser, googleProvider);
  } catch (e) {
    throw e;
  }
}
async function linkGithubWithRedirect() {
  const curUser = auth.currentUser;
  // eslint-disable-next-line no-useless-catch
  try {
    linkWithRedirect(curUser, githubProvider);
  } catch (e) {
    throw e;
  }
}
async function unlinkAccount(providerId) {
  // eslint-disable-next-line no-useless-catch
  try {
    return await unlink(auth.currentUser, providerId);
  } catch (e) {
    throw e;
  }
}

export {
  linkWithEmailPassword,
  linkGoogleWithRedirect,
  linkGithubWithRedirect,
  unlinkAccount,
};
