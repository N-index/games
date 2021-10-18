<template>
  <header>
      <n-text class="ui-logo">
        <img :src="require('../assets/header__logo.jpg')" alt="header__logo" width="35" style="border-radius: 50%;overflow: hidden">
        <span>小游戏</span>
      </n-text>
  </header>
</template>

<script>
import { NText } from "naive-ui";
export default {
  components:{
    NText
  },
}
</script>

<style scoped>
header{
  height: var(--header-height);
  display: flex;
  justify-content: center;
  align-items: center;
}
.ui-logo{
  display: flex;
  align-items: center;
  font-size: 25px;
  gap: 8px;
  transition: all 3s;
}
.ui-logo img{
  animation: in 1s linear infinite paused;
}
.ui-logo:hover img{
  animation-play-state: running;
}
@keyframes in {
  from   { transform: rotate(0deg); }
  to { transform: rotate(360deg);}
}
@media screen and (max-width: 600px){
  header{
    /*padding: 1.5rem .75rem;*/
    flex-direction: row;
    justify-content: center;
  }
}
</style>