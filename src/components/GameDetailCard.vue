<template>
  <n-card style="width: 300px" :title="title">
    <n-collapse :default-expanded-names="['2']" accordion>
      <n-collapse-item title="简介" name="1">
        <template #header-extra>
          <n-icon size="20"><InformationCircleOutline /></n-icon>
        </template>
        <n-ellipsis expand-trigger="click" line-clamp="2" :tooltip="false">
          <slot name="introduce">此游戏没有简介</slot>
        </n-ellipsis>
      </n-collapse-item>

      <n-collapse-item title="玩法" name="2">
        <template #header-extra>
          <n-icon size="20"><GameControllerOutline /></n-icon>
        </template>
        <slot name="playMethod">用手玩</slot>
      </n-collapse-item>
    </n-collapse>
  </n-card>
</template>

<script>
import { NCard, NCollapseItem, NCollapse, NEllipsis, NIcon } from "naive-ui";
import {
  InformationCircleOutline,
  GameControllerOutline,
} from "@vicons/ionicons5";

export default {
  props: {
    title: {
      type: String,
      default: "游戏名字",
    },
  },
  components: {
    NCard,
    NCollapseItem,
    NCollapse,
    NEllipsis,
    NIcon,
    //     NGrid, NGridItem,NTooltip,NDivider,NUl,NLi,
    // ArrowUpOutline, ArrowDownOutline, ArrowBackOutline, ArrowForwardOutline,
    InformationCircleOutline,
    GameControllerOutline,
    // ,TimerOutline
  },
  name: "GameDetail.vue",
};
</script>

<style scoped></style>
