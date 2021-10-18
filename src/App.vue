<template>

  <n-layout position="absolute">

    <n-layout-header bordered position="static">
      <app-header></app-header>
    </n-layout-header>

    <n-layout has-sider position="absolute" style="top: calc(5px + var(--header-height)) ">
      <n-layout-sider
          bordered
          show-trigger
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          :native-scrollbar="false"
      >
        <app-menu></app-menu>
      </n-layout-sider>

      <n-layout position="static" style="" :native-scrollbar="false">
        <n-space style="width: 100%;min-height: calc(100vh - var(--header-height))" justify="center" align="center">

          <router-view ></router-view>
        </n-space>
      </n-layout>
    </n-layout>

  </n-layout>

</template>

<script>
import { defineComponent } from 'vue'
import AppHeader from "./components/AppHeader";
import  AppMenu from './components/AppMenu';
import {NLayout,NLayoutHeader,NLayoutSider,NSpace} from "naive-ui";

export default defineComponent({
  name: 'App',
  components: {
    AppHeader,
    AppMenu,
    NLayout,NLayoutHeader,NLayoutSider,NSpace
  }
})
</script>

<style>
*,
*::before,
*::after{
  margin: 0;
  padding:0;
  box-sizing: inherit;
}
:root{
  font-size: 62.5%;
  box-sizing: border-box;
  min-height: 100vh;
  --header-height: 80px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
