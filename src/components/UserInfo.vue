<template>
  <n-space v-if="loginInfo.photoURL" justify="center" align="center" vertical>
    <n-avatar round :size="80" :src="loginInfo.photoURL" />
    <n-gradient-text
      type="primary"
      v-if="loginInfo.displayName"
      size="22"
      style="font-weight: 900"
    >
      {{ loginInfo.displayName }}
    </n-gradient-text>
  </n-space>
  <n-divider v-if="loginInfo.photoURL">详情</n-divider>
  <n-ul style="list-style: none">
    <n-li v-if="loginInfo.email">
      <n-space align="center">
        <n-icon size="25"><Mail /> </n-icon>
        {{ loginInfo.email }}
        <n-icon v-if="loginInfo.emailVerified">
          <ShieldCheckmark />
        </n-icon>
      </n-space>
    </n-li>
    <n-li v-if="loginInfo.lastLoginAt">
      <n-space align="center">
        <n-icon size="25"> <Timer /> </n-icon>
        上次登录：
        <n-time :time="Number(loginInfo.lastLoginAt)" type="relative" />
      </n-space>
    </n-li>
    <n-li v-if="loginInfo.createdAt">
      <n-space align="center">
        <n-icon size="25"> <Key /> </n-icon>
        注册时间：
        <n-time :time="Number(loginInfo.createdAt)" />
      </n-space>
    </n-li>
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
} from "naive-ui";
import { Mail, ShieldCheckmark, Timer, Key } from "@vicons/ionicons5";
export default {
  name: "UserInfo.vue",
  props: {
    loginInfo: {
      type: Object,
      required: true,
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
};
</script>

<style scoped></style>
