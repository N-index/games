<template>
  <n-card style="width: 250px" :title="title" :bordered="true">
    <n-collapse :default-expanded-names="['2']" accordion>
      <n-collapse-item title="简介" name="1">
        <template #header-extra>
          <n-icon size="20"><InformationCircleOutline /></n-icon>
        </template>

        <div @click="showModal = true" style="cursor: pointer">
          <n-ellipsis line-clamp="2" :tooltip="false">
            <slot name="introduce">此游戏没有简介</slot>
          </n-ellipsis>
        </div>

        <n-modal v-model:show="showModal">
          <n-card style="width: 100%; max-width: 350px">
            <slot name="modalIntroduce">详细简介</slot>
          </n-card>
        </n-modal>
      </n-collapse-item>

      <n-collapse-item title="玩法" name="2">
        <template #header-extra>
          <n-icon size="20"><GameControllerOutline /></n-icon>
        </template>
        <slot name="playMethod">用手玩</slot>
      </n-collapse-item>
    </n-collapse>
    <n-divider></n-divider>
    <n-space justify="center">
      <n-button dashed @click="this.$emit('toggleDrawer')">
        <template #icon>
          <n-icon>
            <BarChart />
          </n-icon>
        </template>
        排行榜
      </n-button>
    </n-space>
  </n-card>
</template>

<script>
import {
  NModal,
  NCard,
  NCollapseItem,
  NCollapse,
  NEllipsis,
  NIcon,
  NButton,
  NDivider,
  NSpace,
} from "naive-ui";
import {
  InformationCircleOutline,
  GameControllerOutline,
  BarChart,
} from "@vicons/ionicons5";

export default {
  data() {
    return {
      showModal: false,
    };
  },
  props: {
    title: {
      type: String,
      default: "游戏名字",
    },
  },
  components: {
    NModal,
    NCard,
    NCollapseItem,
    NCollapse,
    NEllipsis,
    NIcon,
    NButton,
    NDivider,
    NSpace,
    BarChart,
    InformationCircleOutline,
    GameControllerOutline,
  },
  name: "GameDetail.vue",
};
</script>

<style scoped></style>
