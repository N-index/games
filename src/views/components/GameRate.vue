<template>
  <!--  {{ gameKey }} 的受欢迎指数：-->
  <n-alert :show-icon="false" :title="gameName + '评分'">
    <n-rate
      :value="rateVal"
      :on-update:value="rate"
      :default-value="5"
      :allow-half="true"
      :readonly="false && isVoted"
    />
  </n-alert>
</template>

<script>
import { addRate } from "../../firebase/access";
import { NRate, useMessage, NAlert } from "naive-ui";
import { ref } from "vue";

export default {
  setup(props) {
    const message = useMessage();
    const rateVal = ref(
      JSON.parse(localStorage.getItem(`rate_${props.gameKey}`)) || 3.5
    );

    const isVoted = ref(
      JSON.parse(localStorage.getItem(`isVoted_${props.gameKey}`)) || false
    );

    const rate = (score) => {
      if (isVoted.value) {
        message.error(`抱歉，你已经评价过 "${props.gameName}" 了`);
      } else {
        addRate(props.gameKey, score);
        message.success(`为 ${props.gameKey} 投了 ${score} 分。`);
        rateVal.value = score;
        isVoted.value = true;
        localStorage.setItem(`isVoted_${props.gameKey}`, isVoted.value);
        localStorage.setItem(`rate_${props.gameKey}`, rateVal.value);
      }
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
    NAlert,
  },
  props: {
    gameKey: {
      type: String,
      required: true,
    },
    gameName: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped></style>
