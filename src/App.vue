<template>
  <n-message-provider>
    <app-header></app-header>
  </n-message-provider>

  <n-space justify="center">
    <router-view></router-view>
  </n-space>
</template>

<script>
import { defineComponent } from 'vue'
import AppHeader from "./components/AppHeader";
import { NMessageProvider,
  // , NDivider,
  NSpace} from "naive-ui";

export default defineComponent({
  name: 'App',
  components: {
    AppHeader,
    NMessageProvider,
    // NDivider,
    NSpace
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
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
}
</style>
