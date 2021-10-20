<template>
  <n-menu
    :inverted="'inverted'"
    :collapsed-width="64"
    :collapsed-icon-size="22"
    mode="vertical"
    v-model:value="activeKey"
    :options="menuOptions"
  />
</template>

<script>
import {
  AnalyticsOutline,
  AppsOutline,
  SpeedometerOutline,
  HomeOutline,
} from "@vicons/ionicons5";
import { NIcon, NMenu } from "naive-ui";
import { h } from "vue";
import { RouterLink } from "vue-router";
function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}
const menuOptions = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: "/",
          },
        },
        "首页"
      ),
    key: "home",
    icon: renderIcon(HomeOutline),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: "/hungry-snake",
          },
        },
        "贪吃蛇"
      ),
    key: "hungry-snake",
    icon: renderIcon(AnalyticsOutline),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: "/russian-square",
          },
        },
        "俄罗斯方块"
      ),
    key: "russian-square",
    icon: renderIcon(AppsOutline),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: "/insert-needle",
          },
        },
        "见缝插针"
      ),
    key: "insert-needle",
    icon: renderIcon(SpeedometerOutline),
  },
];
export default {
  components: {
    NMenu,
  },
  data() {
    return {
      activeKey: "home",
      menuOptions: menuOptions,
    };
  },
};
</script>

<style scoped>
/* issue */
/*.n-menu-item-content:hover{*/
/*  color: rebeccapurple!important;*/
/*}*/
</style>
