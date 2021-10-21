<template>
  <n-drawer
    :show="isRankDrawerOpen"
    @update:show="this.$emit('toggleDrawer')"
    :width="450"
    placement="right"
  >
    <n-scrollbar>
      <n-drawer-content :title="gameName + '——排行榜'">
        <n-skeleton text :repeat="3" v-if="ratesLoading" />
        <template v-else>
          <n-data-table
            :max-height="400"
            :remote="true"
            :columns="columns"
            :data="ratesData"
            :pagination="false"
            :summary="summary"
          />
        </template>
      </n-drawer-content>
    </n-scrollbar>
  </n-drawer>
</template>

<script>
import { getScore } from "../firebase/access";
import { h, reactive, ref } from "vue";
import {
  NTime,
  useLoadingBar,
  NDrawer,
  NDrawerContent,
  NScrollbar,
  NDataTable,
  NSkeleton,
} from "naive-ui";
const createColumns = () => {
  return [
    {
      title: "分数",
      key: "score",
      align: "center",
    },
    {
      title: "用户",
      key: "user_id",
      align: "center",
    },
    {
      title: "时间",
      key: "add_time",
      render(row) {
        return h(
          NTime,
          {
            time: row.add_time["seconds"],
            unix: true,
            type: "relative",
          },
          { default: () => "默认时间" }
        );
      },
    },
  ];
};
export default {
  props: {
    gameName: {
      type: String,
      required: true,
    },
    gameKey: {
      type: String,
      required: true,
    },
    isRankDrawerOpen: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    NDrawer,
    NDrawerContent,
    NScrollbar,
    NDataTable,
    NSkeleton,
  },
  setup(props) {
    const loadingBar = useLoadingBar();
    const ratesLoading = ref(false);
    const columns = createColumns();
    const pagination = reactive({
      page: 3,
      pageSize: 5,
      pageCount: 3,
      defaultPageSize: 2,
      showSizePicker: true,
    });
    const ratesData = ref([]);
    const summary = (ratesData) => {
      return {
        score: {
          value: `平均分：
          ${
            ratesData.length > 0
              ? (
                  ratesData.reduce((acc, cur) => acc + cur.score, 0) /
                  ratesData.length
                ).toFixed(2)
              : 0
          }
          `,
          colSpan: 3,
        },
      };
    };

    const openDrawer = async () => {
      loadingBar.start();
      ratesLoading.value = true;
      try {
        ratesData.value = await getScore(props.gameKey);
        loadingBar.finish();
        ratesLoading.value = false;
      } catch {
        loadingBar.error();
      }
    };
    return {
      ratesData,
      rowKey(rowData) {
        return rowData.column1;
      },
      summary,
      ratesLoading,
      pagination,
      columns,
      openDrawer,
    };
  },
  watch: {
    isRankDrawerOpen(val) {
      if (!val) return;
      this.openDrawer();
    },
  },
};
</script>

<style scoped></style>
