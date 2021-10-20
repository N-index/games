<template>
  <n-space>
    <game-rate :game-name="'needle'"></game-rate>
    <n-button type="primary">查看needle的 rate 信息</n-button>

    <div
          id="insert-needle-game"
          tabindex="3"
          @keydown.space.prevent="shoot"
          @click="shoot"
      >
        <div
            class="circle"
            :style="{
            transform: `rotate(${rotateDeg}deg)`,
            '--before-rotate': `${-rotateDeg}deg`
          }"
            :data-score="score"
        >
          <div
              class="needle"
              v-for="(needleDeg,index) of needles"
              :style="needleStyle(needleDeg)"
              :key="index"
          ></div>
        </div>
        <transition>
          <div id="shooting-needle" v-show="currentNeedle"></div>
        </transition>
      </div>
    <game-detail-card :title="'见缝插针'">
      <template v-slot:introduce>
        又是一款简单而不简略的游戏，游戏画面简略但玩法新颖。玩家手中有一定数量的针头，必须把所有的针头都插进旋转的球里头。不能够重叠也不能够撞到球上的针，赶紧来挑战吧。
      </template>
      <template v-slot:playMethod>
        <n-ul>
          <n-li>
            操作方法：
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-icon>
                  <HandRightOutline/>
                </n-icon>
              </template>
              鼠标
            </n-tooltip>
          </n-li>
        </n-ul>
      </template>
    </game-detail-card>
  </n-space>
</template>

<script>
import {NUl,NLi,NSpace,NTooltip,NIcon} from "naive-ui";
import {HandRightOutline} from '@vicons/ionicons5';
import GameDetailCard from "../components/GameDetailCard";
import GameRate from "../components/GameRate";
export default {
  components:{
    GameRate,
    NUl,NLi,NSpace,NTooltip,NIcon,
    HandRightOutline,
    GameDetailCard
  },
  name: "InsertNeedle",
  data() {
    return {
      needles: [],
      rotateDeg: 0,
      info: 0,
      start: false,
      showEnding: false,
      currentNeedle: true
    };
  },
  computed: {
    currentNeedleDeg() {
      return (360 + 180 - this.rotateDeg) % 360;
    },
    score() {
      return this.needles.length;
    }
  },
  methods: {
    needleStyle(deg) {
      return {
        transform: `translateX(-50%) rotate(${deg}deg)`
      };
    },
    shoot() {
      this.startGame();
      // 插针
      this.currentNeedle = false;

      setTimeout(() => {
        if (
            this.needles.some((deg) => Math.abs(this.currentNeedleDeg - deg) < 5)
        )
          this.gameOver();
        this.needles.push(this.currentNeedleDeg);
        this.currentNeedle = true;
      }, 300);
    },
    gameOver() {
      this.start = false;
      this.showEnding = true;
      clearTimeout(this.timer);
    },
    startGame() {
      if (this.start) return;
      this.start = true;
      this.needles = [];
      this.showEnding = false;
      this.setTimer();
    },
    setTimer() {
      this.timer = setInterval(() => {
        this.rotateDeg = (this.rotateDeg + 1) % 360;
      }, 15);
    }
  }
};
</script>

<style>
#insert-needle-game{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f1f1f1;
  cursor: pointer;
  width: 200px;
  height: 350px;
  gap:15px;
}
#shooting-needle.v-enter-active {
  transition: none;
}
#shooting-needle.v-leave-active {
  transition: all 0.3s ease-in;
}
#shooting-needle.v-leave-to {
  transform: translateY(-80px);
}
.circle {
  width: 150px;
  height: 150px;
  background-color: transparent;
  border-radius: 50%;
  /*便于调试*/
  /* background-image: conic-gradient(red 0deg 1deg, transparent 1deg); */
  transform: rotate(20deg);
  position: relative;
  will-change: transform;
  --before-rotate: 0;
}
.circle::before {
  z-index: 20;
  content: attr(data-score);
  position: absolute;
  border-radius: 50%;
  width: 20%;
  height: 20%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) rotate(var(--before-rotate));
  background: black;
  color: white;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  will-change: transform;
}
.needle {
  z-index: 1;
  position: absolute;
  left: 50%;
  bottom: 50%;
  height: 80px;
  width: 2px;
  background: black;
  backface-visibility: hidden;
  transform: translateX(-50%) rotate(480deg);
  transform-origin: bottom center;
  will-change: transform;
}
.needle::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background-color: black;
  will-change: transform;
}
#shooting-needle {
  width: 2px;
  height: 75px;
  background-color: black;
  position: relative;
  transform: translateY(0);
  opacity: 1;
}
#shooting-needle::before {
  position: absolute;
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);
  background-color: black;
}
</style>


