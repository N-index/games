import { deleteUser, getAuth, signInAnonymously } from "firebase/auth";

const auth = getAuth();

const signInAnony = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    return signInAnonymously(auth);
  } catch (e) {
    throw e;
  }
};

const deleteAnonymous = async () => {
  if (auth.currentUser && auth.currentUser.isAnonymous) {
    // eslint-disable-next-line no-useless-catch
    try {
      return await deleteUser(auth.currentUser);
    } catch (e) {
      throw e;
    }
  }
};

export { signInAnony, deleteAnonymous };
