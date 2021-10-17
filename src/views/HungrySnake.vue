<template>
  <n-space justify="center">
    <div
        class="game"
        tabindex="0"
        ref="game"
        @keydown.space="pauseGame"
        @keydown.up="turnUp"
        @keydown.down="turnDown"
        @keydown.left="turnLeft"
        @keydown.right="turnRight"
    >
      <n-space style="position: absolute; top: 0; right: 0;" align="center" v-show="time>=1">
        <n-icon size="20"><TimerOutline /></n-icon>
        {{ time }}
      </n-space>
      <div class="row" v-for="x of squares.length" :key="x">
        <div
            class="square"
            :class="{
            'snake-body': isSnakeBody(x, y),
            'snake-head': isSnakeHead(x, y),
            food: isFood(x, y)
          }"
            v-for="y of squares[0].length"
            :key="y"
        ></div>
      </div>
    </div>
    <n-space vertical>
    <n-card style="width: 300px;" title="贪吃蛇🐍">
      <n-collapse :default-expanded-names="['2']" accordion>
        <n-collapse-item title="简介" name="1">
          <template #header-extra>
            <n-icon size="20"><InformationCircleOutline /></n-icon>
          </template>
          <n-ellipsis expand-trigger="click" line-clamp="2" :tooltip="false">
            贪吃蛇（Snake）是一个起源於1976年的街机游戏 Blockade。<br>在游戏中，玩家操控一条细长的直线（称为蛇），它会不停前进，玩家只能操控蛇的头部朝向（上下左右），一路吃掉食物，并要避免触碰到自身或者其他障碍物。<br>每次貪食蛇吃掉一件食物，它的身体便增长一些。吃掉一些食物后會使蛇的移動速度逐漸加快，让游戏的难度渐渐变大。
          </n-ellipsis>
        </n-collapse-item>

        <n-collapse-item title="玩法" name="2">
          <template #header-extra>
            <n-icon size="20"><GameControllerOutline /></n-icon>
          </template>
          <ul style="list-style: none;">
            <li>1. 改变方向:
              <n-grid :cols="3" x-gap="2" style="justify-items: center">
                <n-grid-item :offset="1">
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <n-icon>
                        <ArrowUpOutline/>
                      </n-icon>
                    </template>
                    方向上键
                  </n-tooltip>
                </n-grid-item>
                <n-grid-item>
                </n-grid-item>
                <n-grid-item>
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <n-icon>
                        <ArrowBackOutline/>
                      </n-icon>
                    </template>
                    方向左键
                  </n-tooltip>
                </n-grid-item>
                <n-grid-item>
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <n-icon>
                        <ArrowDownOutline/>
                      </n-icon>
                    </template>
                    方向下键
                  </n-tooltip>
                </n-grid-item>
                <n-grid-item>
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <n-icon>
                        <ArrowForwardOutline/>
                      </n-icon>
                    </template>
                    方向下键
                  </n-tooltip>
                </n-grid-item>
              </n-grid>
            </li>
            <n-divider dashed></n-divider>
            <li>2. 黑色是身体</li>
            <n-divider dashed></n-divider>
            <li>3. 红色是食物</li>
          </ul>
        </n-collapse-item>

      </n-collapse>
    </n-card>
    <n-card title="成绩✌">

    </n-card>
    </n-space>
  </n-space>


</template>

<script>
import {NCard, NCollapseItem, NCollapse, NSpace, NEllipsis, NIcon, NGrid, NGridItem,NTooltip,NDivider} from "naive-ui";
import {ArrowUpOutline, ArrowDownOutline, ArrowBackOutline, ArrowForwardOutline,InformationCircleOutline,GameControllerOutline,TimerOutline} from '@vicons/ionicons5'

export default {
  name: "HungrySnake",
  components: {
    NCard,
    NCollapseItem,
    NCollapse,
    NSpace,
    NEllipsis,
    NIcon,
    ArrowDownOutline,
    ArrowBackOutline,
    ArrowUpOutline,
    ArrowForwardOutline,
    NGrid,
    NGridItem,
    NTooltip,
    InformationCircleOutline,
    GameControllerOutline,
    TimerOutline,
    NDivider
  },
  data() {
    return {
      time:0,
      squares: Array.from({length: 20})
          .fill(0)
          .map((_, x) => Array.from({length: 20}).map((_, y) => [x, y])),
      directions: ["up", "down", "left", "right"],
      currentDirection: "right",
      isStart: false,
      moveTimer: null,
      improveSpeedTimer: null,
      improveSpeedInterval: 15000,
      snakeBody: [[5, 5]],
      food: [2, 3],
      speed: 800
    };
  },
  computed: {
    headPos() {
      return this.snakeBody[0];
    },
    snakeLength() {
      return this.snakeBody.length;
    }
  },
  methods: {
    startGame() {
      if (this.isStart) return;
      this.isStart = true;

      this.setLiveTimer();
      this.setMoveTimer();
      this.setSpeedTimer();
    },
    setLiveTimer(){
      clearInterval(this.liveTimer);
      this.liveTimer = setInterval(()=>{
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
      clearInterval(this.moveTimer);
      this.moveTimer = setTimeout(() => {
        this.move();
        this.setMoveTimer();
      }, this.speed);
    },
    pauseGame() {
      if (this.isStart) {
        clearInterval(this.moveTimer);
        clearInterval( this.liveTimer);
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
        Math.floor(Math.random() * this.squares.length) + 1
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
      let front;
      switch (this.currentDirection) {
        case "up": {
          front = [
            this.headPos[0] > 1 ? this.headPos[0] - 1 : this.squares.length,
            this.headPos[1]
          ];
          break;
        }
        case "down": {
          front = [
            this.headPos[0] < this.squares.length ? this.headPos[0] + 1 : 1,
            this.headPos[1]
          ];
          break;
        }
        case "left": {
          front = [
            this.headPos[0],
            this.headPos[1] > 1 ? this.headPos[1] - 1 : this.squares[0].length
          ];
          break;
        }
        case "right": {
          front = [
            this.headPos[0],
            this.headPos[1] < this.squares[0].length ? this.headPos[1] + 1 : 1
          ];
          break;
        }
      }
      this.snakeBody.pop();
      this.snakeBody.unshift(front);
      this.eatFood();
    },
    async turnUp() {
      if (this.isStart && ["up", "down"].includes(this.currentDirection))
        return;
      this.currentDirection = "up";
      this.startGame();
    },
    async turnDown() {
      if (this.isStart && ["up", "down"].includes(this.currentDirection))
        return;
      this.currentDirection = "down";
      this.startGame();
    },
    async turnLeft() {
      if (this.isStart && ["left", "right"].includes(this.currentDirection))
        return;
      this.currentDirection = "left";
      this.startGame();
    },
    async turnRight() {
      if (this.isStart && ["left", "right"].includes(this.currentDirection))
        return;
      this.currentDirection = "right";
      this.startGame();
    }
  }
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
</style>
