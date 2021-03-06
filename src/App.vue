<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme="theme">
    <n-layout position="absolute">
      <n-layout-header bordered position="static">
        <app-header :is-dark-theme="isDarkTheme"></app-header>
      </n-layout-header>
      <n-layout
        has-sider
        position="absolute"
        style="top: calc(5px + var(--header-height))"
      >
        <n-layout-sider
          bordered
          show-trigger
          collapse-mode="width"
          :collapsed="collapsed"
          :collapsed-width="64"
          @collapse="manuallyCol(true)"
          @expand="manuallyCol(false)"
          :width="240"
          :native-scrollbar="false"
        >
          <app-menu :collapsed="collapsed"></app-menu>
          <n-divider dashed>主题</n-divider>
          <n-space justify="center" align="center">
            <n-switch v-model:value="isDarkTheme">
              <template #checked>
                <n-icon>
                  <Moon />
                </n-icon>
              </template>
              <template #unchecked>
                <n-icon>
                  <Sunny />
                </n-icon>
              </template>
            </n-switch>
          </n-space>

          <n-space justify="center">
            <n-notification-provider>
              <n-message-provider>
                <login-modal></login-modal>
              </n-message-provider>
            </n-notification-provider>
          </n-space>
        </n-layout-sider>
        <n-layout position="static" :native-scrollbar="false">
          <n-space
            style="width: 100%; min-height: calc(100vh - var(--header-height))"
            justify="center"
            align="center"
          >
            <n-dialog-provider>
              <n-loading-bar-provider>
                <n-message-provider>
                  <router-view></router-view>
                </n-message-provider>
              </n-loading-bar-provider>
            </n-dialog-provider>
          </n-space>
        </n-layout>
      </n-layout>
    </n-layout>
  </n-config-provider>
</template>

<script>
import { defineComponent } from "vue";
import AppHeader from "./components/AppHeader";
import AppMenu from "./components/AppMenu";
import LoginModal from "./components/LoginModal/LoginModal";
import {
  NIcon,
  NSwitch,
  NDialogProvider,
  NNotificationProvider,
  NLayout,
  NLayoutHeader,
  NLayoutSider,
  NSpace,
  NDivider,
  NMessageProvider,
  NLoadingBarProvider,
  darkTheme,
} from "naive-ui";
import { NConfigProvider } from "naive-ui";
import { zhCN, dateZhCN } from "naive-ui";
import { Sunny, Moon } from "@vicons/ionicons5";
export default defineComponent({
  name: "App",
  data() {
    return {
      zhCN,
      dateZhCN,
      isDarkTheme: JSON.parse(localStorage.getItem("isDarkTheme")),
      collapsed: false,
    };
  },
  components: {
    LoginModal,
    NNotificationProvider,
    NDialogProvider,
    NConfigProvider,
    NMessageProvider,
    NLoadingBarProvider,
    AppHeader,
    AppMenu,
    NLayout,
    NLayoutHeader,
    NLayoutSider,
    NSpace,
    NSwitch,
    NDivider,
    Sunny,
    Moon,
    NIcon,
  },
  computed: {
    theme() {
      localStorage.setItem("isDarkTheme", JSON.stringify(this.isDarkTheme));
      return this.isDarkTheme ? darkTheme : null;
    },
  },
  created() {
    const media = window.matchMedia("(max-width: 760px)");
    this.collapsed = JSON.parse(localStorage.getItem("colFlag"))
      ? JSON.parse(localStorage.getItem("colValue"))
      : false;
    media.onchange = ({ matches }) => {
      if (JSON.parse(localStorage.getItem("colFlag"))) return;
      this.collapsed = matches;
    };
    const isMobile = window.matchMedia("(max-width):650px");
    if (isMobile.matches) {
      this.collapsed = true;
    }
    isMobile.onchange = ({ matches }) => {
      if (matches) this.collapsed = true;
    };
  },
  methods: {
    manuallyCol(val) {
      this.collapsed = val;
      localStorage.setItem("colFlag", JSON.stringify(true));
      localStorage.setItem("colVal", JSON.stringify(this.collapsed));
    },
  },
});
</script>

<style>
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
}
:root {
  box-sizing: border-box;
  min-height: 100vh;
  --header-height: 80px;
}
</style>
