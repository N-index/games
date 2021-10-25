import { db } from "../db";
import { doc, setDoc, updateDoc } from "firebase/firestore";
export class User {
  constructor(user) {
    this.uid = user.uid;
    this.displayName = user.displayName;
    this.email = user.email;
    this.emailVerified = user.emailVerified;
    this.phoneNumber = user.phoneNumber;
    this.isAnonymous = user.isAnonymous;
    this.photoURL = user.photoURL;
    // 外层的 providerId 跟 providerData 内部的 providerId 是不一样的。外层基本都是 firebase，而内层才是正确的。
    this.providerId = user.providerId;
    this.providerData = user.providerData[0];
    // 包含登录、注册时间的信息
    const metadata = user.metadata.toJSON();
    this.createdAt = metadata.createdAt;
    this.lastLoginAt = metadata.lastLoginAt;
    // token
    const stsTokenManager = user.stsTokenManager.toJSON();
    this.accessToken = stsTokenManager.accessToken;
    this.expirationTime = stsTokenManager.expirationTime;
    this.refreshToken = stsTokenManager.refreshToken;
    // 自建属性
    this.description = user.description;
  }

  toString() {
    return `I'm ${this.displayName}`;
  }

  async updateToDb(key, value) {
    // https://firebase.google.com/docs/auth/web/manage-users 这页里面的方法用于更新 firebase 的 auth 信息。
    // 此方法用于更新 firestore 中的用户信息
    const userRef = doc(db, "users", this.uid);
    await updateDoc(userRef, { [key]: value });
  }

  async addUserToDb() {
    // eslint-disable-next-line no-useless-catch
    try {
      const obj = this.convertToObj();
      const userRef = doc(db, "users", this.uid);
      await setDoc(userRef, obj);
    } catch (e) {
      throw e;
    }
  }

  convertToObj() {
    return {
      uid: this.uid,
      displayName: this.displayName,
      email: this.email,
      emailVerified: this.emailVerified,
      phoneNumber: this.phoneNumber,
      isAnonymous: this.isAnonymous,
      photoURL: this.photoURL,
      // 外层的 providerId 跟 providerData 内部的 providerId 是不一样的。外层基本都是 firebase，而内层才是正确的。
      providerId: this.providerId,
      providerData: this.providerData,
      createdAt: this.createdAt,
      lastLoginAt: this.lastLoginAt,
      // token
      accessToken: this.accessToken,
      expirationTime: this.expirationTime,
      refreshToken: this.refreshToken,

      // 自建属性
      description: this.description || null,
    };
  }

  static fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return new User(data);
  }
}
