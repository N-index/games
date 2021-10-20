<template>
  <n-drawer v-model:show="isDrawerOpen" :width="450" placement="right">
    <n-scrollbar>
      <n-drawer-content :title="gameName+'rate'">
        <n-skeleton text :repeat="3" v-if="ratesLoading"/>
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
import { getRates } from '../firebase/access';
import {h, reactive, ref} from "vue";
import {NTime, useLoadingBar} from "naive-ui";
const createColumns = () => {
  return [
    {
      title: '分数',
      key: 'score',
      align: 'center'
    },
    {
      title: '用户',
      key: 'user_id',
      align:'center'
    },
    {
      title: '时间',
      key: "vote_time",
      render(row){
        return h(
            NTime,
            {
              time: row.vote_time['seconds'],
              unix: true,
              type:'relative'
            },
            {default:()=>'默认时间'}
        )
      }
    }
  ]
}
export default {
  name: "GameRatesDrawer",
  props:{
    gameName:{
      type:String,
      required:true,
    }
  },
  setup(props){
    const loadingBar = useLoadingBar();
    const ratesLoading = ref(false);
    const columns = createColumns();
    const pagination = reactive({
      page: 3,
      pageSize: 5,
      pageCount: 3,
      defaultPageSize:2,
      showSizePicker:true,
    });
    const ratesData = ref([]);
    const summary =  (ratesData)=>{
      return {
        score: {
          value: `平均分：
          ${
              ratesData.length > 0
                  ?
                  (ratesData.reduce((acc,cur)=> acc + cur.score ,0) / ratesData.length).toFixed(2)
                  :0
          }
          `,
          colSpan:3
        }
      }
    }
    const isDrawerOpen = ref(false);

    const openDrawer = async ()=>{
      loadingBar.start();
      ratesLoading.value = true;
      isDrawerOpen.value = true;
      try{
        ratesData.value = await getRates(props.gameName);
        console.log('取回了rates信息！')
        loadingBar.finish();
        ratesLoading.value = false;
      }catch{
        loadingBar.error()
      }
    }
    return {
      isDrawerOpen,
      ratesData,
      rowKey (rowData) {
        return rowData.column1
      },
      summary,
      ratesLoading,
      pagination,
      columns,
      openDrawer,
    }
  }
}
</script>

<style scoped>

</style>