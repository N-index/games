<template>
  <n-menu
    :collapsed="collapsed"
    :collapsed-width="64"
    :collapsed-icon-size="22"
    mode="vertical"
    @update:value="jumpRoute"
    :value="activeKey"
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
function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}
const menuOptions = [
  {
    label: "首页",
    key: "home",
    icon: renderIcon(HomeOutline),
  },
  {
    label: "贪吃蛇",
    key: "hungry-snake",
    icon: renderIcon(AnalyticsOutline),
  },
  {
    label: "俄罗斯方块",
    key: "russian-square",
    icon: renderIcon(AppsOutline),
  },
  {
    label: "见缝插针",
    key: "insert-needle",
    icon: renderIcon(SpeedometerOutline),
  },
];
export default {
  components: {
    NMenu,
  },
  props: {
    collapsed: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      activeKey: "home",
      menuOptions: menuOptions,
    };
  },
  methods: {
    async jumpRoute(key) {
      const navigationResult = await this.$router.push("/" + key);
      if (!navigationResult) {
        this.activeKey = key;
      }
    },
  },
};
</script>

<style scoped>
/* issue */
/*.n-menu-item-content:hover{*/
/*  color: rebeccapurple!important;*/
/*}*/
</style>
