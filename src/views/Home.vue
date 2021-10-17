<template>
    <n-carousel trigger="hover" autoplay style="width: 100%; max-width: 500px">
      <img class="carousel-img" :src="img.url" :alt="img.alt" v-for="img of imgs" :key="img.alt">
    </n-carousel>
</template>

<script>
import {NCarousel} from "naive-ui";

export default {
  name: "Home",
  components:{
    NCarousel
  },
  data(){
    return {
      imgs:[{
        url: require("../assets/snake.jpg"),
        alt:"贪吃蛇"
      },{
        url: require("../assets/square.jpg"),
        alt:"俄罗斯方块"
      },{
        url: require("../assets/needle.jpg"),
        alt:"见缝插针"
      }
      ]
    }
  }
}
</script>

<style scoped>
.carousel-img {
  width: 100%;
  aspect-ratio: 3/2;
  object-fit: cover;
}
</style>