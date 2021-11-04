<template>
  <n-drawer
    :show="isRankDrawerOpen"
    @update:show="this.$emit('toggleDrawer')"
    :width="'100%'"
    style="max-width: 450px"
    placement="right"
  >
    <n-scrollbar>
      <n-drawer-content :title="gameName + '——排行榜'" closable>
        <n-skeleton text :repeat="3" v-if="ratesLoading" />
        <template v-else>
          <n-data-table
            :max-height="450"
            :remote="true"
            :columns="columns"
            :row-class-name="rowClassName"
            :data="rankData"
            :pagination="false"
            :summary="summary"
          />
        </template>
      </n-drawer-content>
    </n-scrollbar>
  </n-drawer>
</template>

<script>
import { getScore, getUser } from "../../firebase/access";
import { h, reactive, ref } from "vue";
import {
  NTime,
  useLoadingBar,
  NDrawer,
  NDrawerContent,
  NScrollbar,
  NDataTable,
  NSkeleton,
  NAvatar,
} from "naive-ui";
import { getAuth } from "firebase/auth";
const createColumns = () => {
  return [
    {
      title: "分数",
      key: "score",
      align: "center",
    },
    {
      title: "用户",
      key: "user",
      align: "center",
      render(row) {
        if (row.user.photoURL) {
          return h(NAvatar, {
            round: true,
            size: "medium",
            src: row.user.photoURL,
            title: row.user.displayName,
          });
        } else {
          return h(
            NAvatar,
            {
              round: true,
              size: "medium",
              title: row.user.displayName,
            },
            row.user.displayName || "无名"
          );
        }
      },
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
    const rankData = ref([]);
    const summary = (rankData) => {
      return {
        score: {
          value: `平均分：
          ${
            rankData.length > 0
              ? (
                  rankData.reduce((acc, cur) => acc + cur.score, 0) /
                  rankData.length
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
        const records = await getScore(props.gameKey);
        rankData.value = records;
        if (records.length) {
          const userPaths = records.map(({ user }) => user.path);
          const users = await Promise.all(
            userPaths.map((userPath) => getUser(userPath))
          );
          records.forEach((rate, index) => {
            records[index].user = users[index];
          });
          rankData.value = records;
        }

        loadingBar.finish();
        ratesLoading.value = false;
      } catch (e) {
        // console.log(e.code);
        // console.log(e.message);
        loadingBar.error();
        throw e;
      }
    };
    return {
      rankData,
      rowKey(rowData) {
        return rowData.column1;
      },
      rowClassName(rowData) {
        if (
          getAuth().currentUser &&
          rowData?.user?.uid === getAuth().currentUser.uid
        ) {
          return "himself";
        }
        return null;
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
<style scoped>
::v-deep(.himself td) {
  color: white !important;
  background-color: #0bb8a2 !important;
}
</style>
