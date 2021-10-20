<template>
  {{ gameName }} 的受欢迎指数：
  <n-rate
    :value="rateVal"
    :on-update:value="rate"
    :default-value="5"
    :allow-half="true"
    :readonly="isVoted"
  />
</template>

<script>
import { addRate } from "../firebase/access";
import { NRate, useMessage } from "naive-ui";
import { ref } from "vue";

export default {
  setup(props) {
    const message = useMessage();
    const rateVal = ref(3.5);
    const isVoted = ref(false);

    const rate = (score) => {
      message.success(`为 ${props.gameName} 投了 ${score} 分。`);
      addRate(props.gameName, score);
      rateVal.value = score;
      isVoted.value = true;
    };
    return {
      rateVal,
      rate,
      isVoted,
    };
  },
  name: "GameRate.vue",
  components: {
    NRate,
  },
  props: {
    gameName: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped></style>
