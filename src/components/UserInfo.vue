<template>
  <n-space v-if="user.photoURL" justify="center" align="center" vertical>
    <n-avatar round :size="80" :src="user.photoURL" />
    <n-gradient-text
      type="primary"
      v-if="user.displayName || user.providerData.displayName"
      size="22"
      style="font-weight: 900"
    >
      {{ user.displayName || user.providerData.displayName }}
    </n-gradient-text>
  </n-space>

  <n-divider v-if="user.photoURL">详情</n-divider>
  <n-ul style="list-style: none">
    <n-li v-if="user.email || user.providerData.email">
      <n-space align="center">
        <n-icon size="25"><Mail /> </n-icon>
        {{ user.email || user.providerData.email }}
        <n-icon v-if="user.emailVerified" :color="checkedColor">
          <ShieldCheckmark />
        </n-icon>
      </n-space>
    </n-li>
    <n-li v-if="user.lastLoginAt">
      <n-space align="center">
        <n-icon size="25"> <Timer /> </n-icon>
        上次登录：
        <n-time :time="Number(user.lastLoginAt)" type="relative" />
      </n-space>
    </n-li>
    <n-li v-if="user.createdAt">
      <n-space align="center">
        <n-icon size="25"> <Key /> </n-icon>
        注册时间：
        <n-time :time="Number(user.createdAt)" />
      </n-space>
    </n-li>
    <!--    <n-li>过期时间<n-time :time="Number(user.expirationTime)" /></n-li>-->
  </n-ul>
</template>

<script>
import {
  NDivider,
  NSpace,
  NUl,
  NLi,
  NIcon,
  NAvatar,
  NTime,
  NGradientText,
  useThemeVars,
} from "naive-ui";
import { Mail, ShieldCheckmark, Timer, Key } from "@vicons/ionicons5";
import { getAuth, updateProfile } from "firebase/auth";
export default {
  methods: {
    async updateToDbManually() {
      // 更新 firestore 中的 user 表。
      // await this.user.updateToDb("email", this.email);
    },
    updateProfile() {
      if (!getAuth().currentUser) return;
      // 更新 firebase auth 的信息
      updateProfile(getAuth().currentUser, { displayName: "王八蛋" })
        .then(() => {
          console.log("profile updated!!");
        })
        .catch((e) => {
          throw e;
        });
    },
  },
  name: "UserInfo.vue",
  props: {
    user: {
      require: true,
    },
  },
  components: {
    NDivider,
    NGradientText,
    NTime,
    NAvatar,
    NSpace,
    NUl,
    NLi,
    NIcon,
    Mail,
    ShieldCheckmark,
    Timer,
    Key,
  },
  created() {
    this.checkedColor = useThemeVars().value.primaryColor;
  },
};
</script>

<style scoped></style>
