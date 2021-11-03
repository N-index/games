<template>
  <n-tabs
    justify-content="space-evenly"
    type="line"
    default-value="snake"
    @update:value="handleUpdateValue"
  >
    <n-tab-pane name="snake" tab="贪吃蛇">
      <n-data-table
        :loading="snakeLoading"
        :min-height="100"
        :max-height="300"
        :remote="true"
        :columns="columns"
        :data="snakeData"
        :pagination="false"
      />
    </n-tab-pane>
    <n-tab-pane name="square" tab="俄罗斯方块">
      <n-data-table
        :loading="squareLoading"
        :min-height="100"
        :max-height="300"
        :remote="true"
        :columns="columns"
        :data="squareData"
        :pagination="false"
      />
    </n-tab-pane>
    <n-tab-pane name="needle" tab="见缝插针">
      <n-data-table
        :loading="needleLoading"
        :min-height="100"
        :max-height="300"
        :remote="true"
        :columns="columns"
        :data="needleData"
        :pagination="false"
      />
    </n-tab-pane>
  </n-tabs>
</template>

<script>
import { NDataTable, NTime, NTabs, NTabPane } from "naive-ui";
import { h } from "vue";
import { getScoreOfUser } from "../../../firebase/access";
const createColumns = () => {
  return [
    {
      title: "分数",
      key: "score",
      align: "center",
    },
    {
      title: "时间",
      key: "add_time",
      align: "center",
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
  name: "UserScore",
  props: ["user"],
  methods: {
    handleUpdateValue(tabName) {
      this[tabName + "Loading"] = true;
      getScoreOfUser(tabName).then((res) => {
        this[tabName + "Data"] = res;
        this[tabName + "Loading"] = false;
      });
      return true;
    },
  },
  created() {
    this.snakeLoading = true;
    getScoreOfUser("snake").then((res) => {
      this.snakeData = res;
      this.snakeLoading = false;
    });
  },
  data() {
    return {
      loading: false,
      columns: createColumns(),
      snakeLoading: false,
      squareLoading: false,
      needleLoading: false,
      snakeData: [],
      squareData: [],
      needleData: [],
    };
  },
  components: {
    NTabs,
    NTabPane,
    NDataTable,
  },
};
</script>

<style scoped></style>
