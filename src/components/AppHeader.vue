<template>

  <header>
    <n-space justify="center">
      <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
    </n-space>
  </header>
<!--  选中的菜单：{{activeKey}}-->
</template>

<script>

import { AnalyticsOutline,AppsOutline,SpeedometerOutline,HomeOutline } from '@vicons/ionicons5'
import {NIcon,NMenu, NSpace,useMessage } from "naive-ui";
import {h} from "vue";
import { RouterLink } from 'vue-router';
function renderIcon (icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
const menuOptions = [
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                path: '/',
              }
            },
            '首页'
        ),
    key: 'home',
    icon: renderIcon(HomeOutline)
  },
  {
    label: () =>
        h(
            RouterLink,
      {
              to: {
                path: '/hungry-snake',

              }
            },
            '贪吃蛇'
        ),
    key: 'hungry-snake',
    icon: renderIcon(AnalyticsOutline)
  },
  {
    label:  () =>
        h(
            RouterLink,
            {
              to: {
                path: '/russian-square',
              }
            },
            '经典俄罗斯方块'
        ),
    key: 'russian-square',
    icon: renderIcon(AppsOutline),
  },
  {
    label:  () =>
        h(
            RouterLink,
            {
              to: {
                path: '/insert-needle',
              }
            },
            '见缝插针'
        ),
    key: 'insert-needle',
    icon: renderIcon(SpeedometerOutline),
  }
]
export default {
  components:{
    NMenu,
    NSpace,

  },
  setup(){
    // 这个message必须放到setup里，如果用传统的方式写，会报错。
    // 但是呢，我又不是很懂setup，所以可以看到，我是混着用的，下面的data还有一些数据,不知道在setyp里怎么表示data
    const message = useMessage();
    return {
      menuOptions,
      showMsg(){
        message.success("caonimadebishiba!",{
         duration: 1500
        })
      }
    }
  },
  data(){
    return {
      activeKey:'hungry-snake'
    }
  },

}
</script>

<style scoped>
header{
  padding: 6rem 2rem;
}
</style>