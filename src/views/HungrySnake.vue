<template>
  <n-space vertical>
    <game-rate :gameKey="gameKey" :gameName="gameName"></game-rate>
    <n-space justify="center">
      <div
        style="margin-right: auto"
        class="game"
        tabindex="0"
        ref="game"
        @keydown.space.prevent="pauseGame"
        @keydown.up.prevent="turnUp"
        @keydown.down.prevent="turnDown"
        @keydown.left.prevent="turnLeft"
        @keydown.right.prevent="turnRight"
      >
        <div class="snake__score" v-show="isEnd">
          <template v-if="time <= 0"> 任意方向键开始 </template>
          <template v-else>
            <span style="font-size: 20px">
              游戏结束： 您的得分是 {{ score }}
            </span>
            <br />
            任意方向键重新开始...
          </template>
        </div>
        <div
          style="
            display: flex;
            align-items: center;
            gap: 3px;
            justify-content: center;
            position: absolute;
            top: 0;
            right: 0;
          "
          v-show="time >= 1"
        >
          <n-icon size="18"><TimerOutline /></n-icon>
          <span>{{ time }}s</span>
        </div>
        <div class="row" v-for="x of squares.length" :key="x">
          <div
            class="square"
            :class="{
              'snake-body': isSnakeBody(x, y),
              'snake-head': isSnakeHead(x, y),
              food: isFood(x, y),
            }"
            v-for="y of squares[0].length"
            :key="y"
          ></div>
        </div>
      </div>
      <n-space vertical>
        <game-detail-card :title="gameName" @toggleDrawer="toggleDrawer">
          <template v-slot:introduce>
            贪吃蛇（Snake）是一个起源於1976年的街机游戏 Blockade。<br />在游戏中，玩家操控一条细长的直线（称为蛇），它会不停前进，玩家只能操控蛇的头部朝向（上下左右），一路吃掉食物，并要避免触碰到自身或者其他障碍物。<br />每次貪食蛇吃掉一件食物，它的身体便增长一些。吃掉一些食物后會使蛇的移動速度逐漸加快，让游戏的难度渐渐变大。
          </template>
          <template v-slot:modalIntroduce>
            贪吃蛇（Snake）是一个起源於1976年的街机游戏 Blockade。<br />在游戏中，玩家操控一条细长的直线（称为蛇），它会不停前进，玩家只能操控蛇的头部朝向（上下左右），一路吃掉食物，并要避免触碰到自身或者其他障碍物。<br />每次貪食蛇吃掉一件食物，它的身体便增长一些。吃掉一些食物后會使蛇的移動速度逐漸加快，让游戏的难度渐渐变大。
          </template>
          <template v-slot:playMethod>
            <n-ul>
              <n-li
                >改变方向
                <n-grid :cols="3" x-gap="2" style="justify-items: center">
                  <n-grid-item :offset="1">
                    <n-tooltip trigger="hover">
                      <template #trigger>
                        <n-icon>
                          <ArrowUpOutline />
                        </n-icon>
                      </template>
                      方向上键
                    </n-tooltip>
                  </n-grid-item>
                  <n-grid-item> </n-grid-item>
                  <n-grid-item>
                    <n-tooltip trigger="hover">
                      <template #trigger>
                        <n-icon>
                          <ArrowBackOutline />
                        </n-icon>
                      </template>
                      方向左键
                    </n-tooltip>
                  </n-grid-item>
                  <n-grid-item>
                    <n-tooltip trigger="hover">
                      <template #trigger>
                        <n-icon>
                          <ArrowDownOutline />
                        </n-icon>
                      </template>
                      方向下键
                    </n-tooltip>
                  </n-grid-item>
                  <n-grid-item>
                    <n-tooltip trigger="hover">
                      <template #trigger>
                        <n-icon>
                          <ArrowForwardOutline />
                        </n-icon>
                      </template>
                      方向下键
                    </n-tooltip>
                  </n-grid-item>
                </n-grid>
              </n-li>
              <n-li>暂停：空格键</n-li>
              <n-li>黑色是蛇的身体</n-li>
              <n-li>红色是目标食物</n-li>
              <n-li> <n-text type="success"> 任意方向键开始游戏</n-text></n-li>
            </n-ul>
          </template>
        </game-detail-card>
      </n-space>
    </n-space>
  </n-space>
  <game-rank-drawer
    :gameName="gameName"
    :gameKey="gameKey"
    :isRankDrawerOpen="isRankDrawerOpen"
    @toggleDrawer="toggleDrawer"
  >
  </game-rank-drawer>
</template>

<script>
import {
  NSpace,
  NIcon,
  NGrid,
  NGridItem,
  NTooltip,
  NUl,
  NLi,
  NText,
  useDialog,
} from "naive-ui";
import {
  ArrowUpOutline,
  ArrowDownOutline,
  ArrowBackOutline,
  ArrowForwardOutline,
  TimerOutline,
} from "@vicons/ionicons5";
import GameDetailCard from "./components/GameDetailCard";
import GameRankDrawer from "./components/GameRankDrawer";
import GameRate from "./components/GameRate";
import { ref } from "vue";
import { addScore } from "../firebase/access";
import { signInAnony } from "../firebase/auth/anonymousAuth";
import { getAuth } from "firebase/auth";
const auth = getAuth();
export default {
  name: "HungrySnake",
  props: ["user"],
  setup() {
    const dialog = useDialog();
    const isRankDrawerOpen = ref(false);
    function toggleDrawer() {
      isRankDrawerOpen.value = !isRankDrawerOpen.value;
    }
    const gameName = "贪吃小蛇";
    const gameKey = "snake";
    return {
      gameKey,
      gameName,
      dialog,
      isRankDrawerOpen,
      toggleDrawer,
    };
  },
  async beforeRouteLeave() {
    if (this.isStart) {
      return await new Promise((resolve) => {
        this.dialog.warning({
          title: "是否离开",
          content: `"${this.gameName}" 正在运行，是否离开？`,
          maskClosable: false,
          closable: false,
          positiveText: "离开",
          negativeText: "留下",
          onPositiveClick: () => {
            this.resetGame();
            resolve(true);
          },
          onNegativeClick: () => {
            resolve(false);
          },
        });
      });
    }
  },
  components: {
    GameRate,
    GameDetailCard,
    GameRankDrawer,
    NSpace,
    NIcon,
    ArrowDownOutline,
    ArrowBackOutline,
    ArrowUpOutline,
    ArrowForwardOutline,
    NGrid,
    NGridItem,
    NTooltip,
    TimerOutline,
    NUl,
    NLi,
    NText,
  },
  data() {
    return {
      time: 0,
      squares: Array.from({ length: 20 })
        .fill(0)
        .map((_, x) => Array.from({ length: 20 }).map((_, y) => [x, y])),
      directions: ["up", "down", "left", "right"],
      currentDirection: "right",
      isStart: false,
      isEnd: true,
      moveTimer: null,
      improveSpeedTimer: null,
      improveSpeedInterval: 15000,
      snakeBody: [
        [
          Math.floor(Math.random() * 20 + 1),
          Math.floor(Math.random() * 20 + 1),
        ],
      ],
      food: [
        Math.floor(Math.random() * 20 + 1),
        Math.floor(Math.random() * 20 + 1),
      ],
      speed: 800,
      isDialogOpen: false,
    };
  },
  computed: {
    score() {
      return this.time + this.snakeLength * 100;
    },
    headPos() {
      return this.snakeBody[0];
    },
    snakeLength() {
      return this.snakeBody.length;
    },
  },
  methods: {
    preStartGame() {
      if (this.isDialogOpen) return;
      if (!auth.currentUser) {
        this.isDialogOpen = true;
        this.dialog.info({
          title: "是否创建匿名用户？",
          content:
            "为方便保存游戏记录，系统建议使用匿名帐户开启游戏。稍后您可将此匿名帐户升级为永久帐户",
          positiveText: "创建",
          negativeText: "不了",
          maskClosable: false,
          closable: false,
          onPositiveClick: () => {
            return new Promise((resolve) => {
              signInAnony().then(() => {
                resolve();
                this.isDialogOpen = false;
                this.startGame();
              });
            });
          },
          onNegativeClick: () => {
            this.isDialogOpen = false;
          },
        });
      } else {
        this.startGame();
      }
    },
    startGame() {
      if (this.isStart) return;
      this.isStart = true;
      this.isEnd = false;
      this.time = 0;

      this.setLiveTimer();
      this.setMoveTimer();
      this.setSpeedTimer();
    },
    resetGame() {
      this.isStart = false;
      this.isEnd = true;
      this.snakeBody = [
        [
          Math.floor(Math.random() * 20 + 1),
          Math.floor(Math.random() * 20 + 1),
        ],
      ];
      this.food = [
        Math.floor(Math.random() * 20 + 1),
        Math.floor(Math.random() * 20 + 1),
      ];
      this.speed = 800;

      clearInterval(this.liveTimer);
      clearInterval(this.improveSpeedTimer);
      (() => {
        clearTimeout(this.moveTimer);
        console.log("游戏结束，清除自动步进");
      })();
    },
    gameOver() {
      addScore(this.gameKey, this.score);
      this.resetGame();
    },
    setLiveTimer() {
      clearInterval(this.liveTimer);
      this.liveTimer = setInterval(() => {
        this.time++;
      }, 1000);
    },
    setSpeedTimer() {
      clearInterval(this.improveSpeedTimer);
      this.improveSpeedTimer = setInterval(() => {
        this.speed -= 100;
        if (this.speed <= 100) clearInterval(this.improveSpeedTimer);
      }, this.improveSpeedInterval);
    },
    setMoveTimer() {
      clearTimeout(this.moveTimer);
      if (!this.isStart || this.isEnd) return;
      this.moveTimer = setTimeout(() => {
        this.move();
        this.setMoveTimer();
      }, this.speed);
    },
    pauseGame() {
      if (this.isStart) {
        clearTimeout(this.moveTimer);
        clearInterval(this.liveTimer);
        clearInterval(this.improveSpeedTimer);
        this.isStart = false;
      }
    },
    isSnakeHead(posX, posY) {
      return this.headPos[0] === posX && this.headPos[1] === posY;
    },
    isSnakeBody(posX, posY) {
      return this.snakeBody.filter(([x, y]) => x === posX && y === posY).length;
    },
    isFood(posX, posY) {
      return this.food[0] === posX && this.food[1] === posY;
    },
    generateFood() {
      this.food = [
        Math.floor(Math.random() * this.squares.length) + 1,
        Math.floor(Math.random() * this.squares.length) + 1,
      ];
    },
    eatFood() {
      if (
        this.headPos[0] === this.food[0] &&
        this.headPos[1] === this.food[1]
      ) {
        this.snakeBody.push(this.food);
        do {
          this.generateFood();
          // 最后没空间了，会卡死。
        } while (this.isSnakeBody(this.food[0], this.food[1]));
      }
    },
    move() {
      console.log("进入到move里面");
      let front;
      switch (this.currentDirection) {
        case "up": {
          front = [
            this.headPos[0] > 1 ? this.headPos[0] - 1 : this.squares.length,
            this.headPos[1],
          ];
          break;
        }
        case "down": {
          front = [
            this.headPos[0] < this.squares.length ? this.headPos[0] + 1 : 1,
            this.headPos[1],
          ];
          break;
        }
        case "left": {
          front = [
            this.headPos[0],
            this.headPos[1] > 1 ? this.headPos[1] - 1 : this.squares[0].length,
          ];
          break;
        }
        case "right": {
          front = [
            this.headPos[0],
            this.headPos[1] < this.squares[0].length ? this.headPos[1] + 1 : 1,
          ];
          break;
        }
      }
      if (
        this.snakeBody.find(
          (body) => body[0] === front[0] && body[1] === front[1]
        )
      ) {
        console.log("gameover!");
        this.gameOver();
      } else {
        this.snakeBody.pop();
        this.snakeBody.unshift(front);
        this.eatFood();
      }
    },
    async turnUp() {
      if (this.isStart && ["up", "down"].includes(this.currentDirection))
        return;
      this.currentDirection = "up";
      this.preStartGame();
    },
    async turnDown() {
      if (this.isStart && ["up", "down"].includes(this.currentDirection))
        return;
      this.currentDirection = "down";
      this.preStartGame();
    },
    async turnLeft() {
      if (this.isStart && ["left", "right"].includes(this.currentDirection))
        return;
      this.currentDirection = "left";
      this.preStartGame();
    },
    async turnRight() {
      if (this.isStart && ["left", "right"].includes(this.currentDirection))
        return;
      this.currentDirection = "right";
      this.preStartGame();
    },
  },
};
</script>

<style>
.game {
  position: relative;
  display: flex;
  flex-direction: column;
  font-size: 15px;
}

.game:focus {
  outline: none;
  border: none;
}
.row {
  display: flex;
}
.square {
  width: 15px;
  height: 15px;
  background-color: #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.food {
  background-color: red;
}

.snake-body {
  background-color: #777;
}

.snake-head {
  background-color: black;
}
.snake__score {
  position: absolute;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(2px);
  background-color: rgba(200, 200, 200, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
