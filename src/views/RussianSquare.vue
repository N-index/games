<template>
  <n-space vertical>
    <game-rate :gameKey="gameKey" :gameName="gameName"></game-rate>
    <n-space justify="center" align="start">
      <div
        id="russian-square"
        ref="russian-square"
        tabindex="1"
        @keydown.space.prevent="transform"
        @keydown.down.prevent="down"
        @keydown.left.prevent="left"
        @keydown.right.prevent="right"
      >
        <section class="section">
          <main class="main">
            <div class="overlay" v-show="isEnd">
              <h2>游戏结束</h2>
              <span>您的得分：{{ score }}</span>
            </div>
            <div class="row" v-for="(row, rowIndex) of squares" :key="rowIndex">
              <div
                class="square"
                v-for="(number, colIndex) of row"
                :key="colIndex"
                :class="{
                  shape: isShapeBody(rowIndex, colIndex),
                  notEmpty: number !== 0,
                }"
              >
                <!--           {{ number }} -->
              </div>
            </div>
          </main>
          <aside class="aside">
            <div class="next-shape">
              <div
                class="row"
                v-for="(row, rowIndex) of nextShape.squares"
                :key="rowIndex"
              >
                <div
                  class="square"
                  v-for="(number, colIndex) of row"
                  :key="colIndex"
                  :class="{ shape: number === 1 }"
                ></div>
              </div>
            </div>
            <div class="score">分数：{{ score }}</div>

            <div class="btn-group">
              <n-button type="primary" round dashed @click="preStart">
                {{ isStart ? "重新开始" : "开始" }}
              </n-button>
            </div>
          </aside>
        </section>
      </div>
      <game-detail-card :title="gameName" @toggleDrawer="toggleDrawer">
        <template v-slot:introduce>
          《俄罗斯方块》（俄语：Тетрис，英语：Tetris），是1980年末期至1990年代初期风靡全世界的电脑游戏，是落下型益智游戏的始祖，为苏联首个在美国发布的娱乐软件。此游戏最初由阿列克谢·帕基特诺夫在苏联设计和编写，于1984年6月6日首次发布，当时他正在苏联科学院电算中心工作。此游戏的名称是由希腊语数字四的前缀“tetra-”（因所有落下方块皆由四块组成）和帕基特诺夫最喜欢的运动网球（“tennis”）拼接而成。
        </template>
        <template v-slot:modalIntroduce>
          《俄罗斯方块》（俄语：Тетрис，英语：Tetris），是1980年末期至1990年代初期风靡全世界的电脑游戏，是落下型益智游戏的始祖，为苏联首个在美国发布的娱乐软件。此游戏最初由阿列克谢·帕基特诺夫在苏联设计和编写，于1984年6月6日首次发布，当时他正在苏联科学院电算中心工作。此游戏的名称是由希腊语数字四的前缀“tetra-”（因所有落下方块皆由四块组成）和帕基特诺夫最喜欢的运动网球（“tennis”）拼接而成。
        </template>
        <template v-slot:playMethod>
          <n-ul>
            <n-li>
              左右移动:
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-icon>
                    <ArrowBackOutline />
                  </n-icon>
                </template>
                方向左键
              </n-tooltip>
              &nbsp;
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-icon>
                    <ArrowForwardOutline />
                  </n-icon>
                </template>
                方向右键
              </n-tooltip>
            </n-li>
            <n-li>
              下落：
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-icon>
                    <ArrowDownOutline />
                  </n-icon>
                </template>
                方向下键
              </n-tooltip>
            </n-li>
            <n-li>
              变形：
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-icon>
                    <PhoneLandscapeSharp />
                  </n-icon>
                </template>
                空格键
              </n-tooltip>
            </n-li>
            <n-li>
              <n-text type="warning">若空间不够，则无法变形</n-text>
            </n-li>
            <n-li>
              <n-text type="warning"
                >使用鼠标点击游戏主体，确保处于 focus 状态</n-text
              >
            </n-li>
          </n-ul>
        </template>
      </game-detail-card>
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
import GameRankDrawer from "./components/GameRankDrawer";
import GameRate from "./components/GameRate";
import {
  NButton,
  NIcon,
  NSpace,
  NTooltip,
  NUl,
  NLi,
  NText,
  useDialog,
} from "naive-ui";
import GameDetailCard from "./components/GameDetailCard";
import {
  PhoneLandscapeSharp,
  ArrowBackOutline,
  ArrowForwardOutline,
  ArrowDownOutline,
} from "@vicons/ionicons5";
import { shapes } from "../utils/squareShapes";
import { ref } from "vue";
import { addScore } from "../firebase/access";
import { signInAnony } from "../firebase/auth/anonymousAuth";
import { getAuth } from "firebase/auth";
const auth = getAuth();

export default {
  setup() {
    const dialog = useDialog();
    const gameName = "俄罗斯方块";
    const gameKey = "square";
    const isRankDrawerOpen = ref(false);
    function toggleDrawer() {
      isRankDrawerOpen.value = !isRankDrawerOpen.value;
    }
    return {
      dialog,
      gameKey,
      gameName,
      isRankDrawerOpen,
      toggleDrawer,
    };
  },
  async beforeRouteLeave() {
    if (!this.isStart) return true;
    return await new Promise((resolve) => {
      this.dialog.warning({
        title: "是否离开",
        content: `"${this.gameName}" 正在运行，是否离开？`,
        maskClosable: false,
        positiveText: "离开",
        negativeText: "留下",
        onPositiveClick: () => {
          resolve(true);
        },
        onNegativeClick: () => {
          resolve(false);
        },
      });
    });
  },
  components: {
    GameRankDrawer,
    GameRate,
    GameDetailCard,
    NButton,
    NIcon,
    NSpace,
    PhoneLandscapeSharp,
    ArrowBackOutline,
    ArrowForwardOutline,
    ArrowDownOutline,
    NTooltip,
    NUl,
    NLi,
    NText,
  },
  data() {
    return {
      squares: Array.from({ length: 10 }).map(() =>
        Array.from({ length: 10 }).fill(0)
      ),
      baseX: 10,
      baseY: 0,
      score: 0,
      nextShape: {
        squares: [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
      },
      shapePos: [[]],
      origin: [1, 1],
      timer: null,
      isStart: false,
      isEnd: false,
    };
  },
  created() {
    this.length = 10;
  },
  methods: {
    isShapeBody(posX, posY) {
      return this.shapePos.filter(([x, y]) => x === posX && y === posY).length;
    },
    reset() {
      clearTimeout(this.timer);
      this.squares = Array.from({ length: this.length }).map(() =>
        Array.from({ length: this.length }).fill(0)
      );
      this.isStart = false;
      this.score = 0;
      this.generateNextShape();
      this.isEnd = false;
    },
    preStart() {
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
            console.log("点击了拒绝按钮");
          },
        });
      } else {
        this.startGame();
      }
    },
    startGame() {
      this.reset();
      this.isStart = true;
      this.$refs["russian-square"].focus();
      this.shapeToPos();
      this.generateNextShape();
      this.setTimer();
    },
    gameOver() {
      clearTimeout(this.timer);
      this.isStart = false;
      this.isEnd = true;
      addScore(this.gameKey, this.score);
    },
    setTimer() {
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        this.setTimer();
        this.down();
      }, 1000);
    },
    shapeToPos() {
      const shapePos = [];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (this.nextShape.squares[i][j] === 1) shapePos.push([i, j]);
        }
      }
      this.shapePos = shapePos;
      this.origin = [1, 1];
    },
    generateNextShape() {
      const randomShape = Math.floor(Math.random() * 7);
      const nextShape = new shapes[randomShape]();
      const randomDirection = Math.floor(Math.random() * nextShape.limit);
      for (let i = 0; i < randomDirection; i++) nextShape.transform();
      this.nextShape = nextShape;
    },
    transform() {
      if (this.isEnd) return;

      const after = [];
      for (const [posX, posY] of this.shapePos) {
        const [offsetX, offsetY] = [
          this.origin[0] - posX,
          this.origin[1] - posY,
        ];
        after.push([this.origin[0] - offsetY, this.origin[1] + offsetX]);
      }
      // 不能变换的情况
      const isConflict = ([x, y]) =>
        this.squares[x][y] === 1 ||
        x < 0 ||
        x > this.length - 1 ||
        y < 0 ||
        y > this.length - 1;
      if (after.some(isConflict)) return;
      this.shapePos = after;
    },
    left() {
      if (this.isEnd) return;
      if (
        this.shapePos.some(([x, y]) => y <= 0 || this.squares[x][y - 1] === 1)
      )
        return;
      this.shapePos = this.shapePos.map(([x, y]) => [x, y - 1]);
      this.origin[1] -= 1;
    },
    right() {
      if (this.isEnd) return;

      if (
        this.shapePos.some(
          ([x, y]) => y >= this.length - 1 || this.squares[x][y + 1] === 1
        )
      )
        return;
      this.shapePos = this.shapePos.map(([x, y]) => [x, y + 1]);
      this.origin[1] += 1;
    },
    resolve() {
      const resolveRows = this.squares.filter((row) =>
        row.every((number) => number === 1)
      );
      this.score += resolveRows.length;
      const restRows = this.squares.filter((row) =>
        row.some((number) => number !== 1)
      );
      if (restRows.length === this.squares.length) return;
      const emptyRow = Array.from({
        length: this.squares.length - restRows.length,
      }).map(() => Array.from({ length: this.length }).fill(0));

      this.squares = [...emptyRow, ...restRows];
    },
    down() {
      if (this.isEnd) return;

      if (this.checkMeet()) {
        this.shapePos.forEach(([x, y]) => {
          this.squares[x][y] = 1;
        });
        // 消消乐
        this.resolve();
        if (this.squares[1][1] === 1) this.gameOver();
        // 发放下一个方块
        this.shapeToPos();
        this.generateNextShape();
        return;
      }
      this.shapePos = this.shapePos.map(([x, y]) => [x + 1, y]);
      this.origin[0] += 1;
    },
    checkMeet() {
      return this.shapePos.some(
        ([x, y]) => x >= this.length - 1 || this.squares[x + 1][y] === 1
      );
    },
  },
};
</script>

<style>
#russian-square {
  display: flex;
  flex-direction: column;
  gap: 10px;

  justify-content: center;
  align-items: center;
}

header.header h1 {
  font-size: 20px;
  margin-bottom: 8px;
  text-align: center;
}

header.header ul {
  list-style: none;
  font-size: 14px;
}

section.section {
  display: flex;
  gap: 5px;
}

aside.aside {
  display: flex;
  flex-direction: column;
}

aside.aside .shape {
  background-color: #00dbde;
}

.next-shape {
  display: flex;
  flex-direction: column;
}

.next-shape .row {
  display: flex;
}

.next-shape .square {
  width: 20px;
  height: 20px;
  background-color: #eee;
}

.score {
  text-align: center;
  font-size: 18px;
}

.btn-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.btn-group button {
  padding: 10px 2px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
}

main.main {
  align-self: center;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

main.main .row {
  display: flex;
  gap: 1px;
}

main.main .square {
  width: 20px;
  height: 20px;
  background-color: #c6bfbf;
}

main.main .notEmpty {
  background-color: #517f80;
}

main.main .shape {
  background-color: #c95840;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: grid;
  place-content: center;
  background-color: rgba(215, 215, 215, 0.71);
  color: #4f4f4f;
  backdrop-filter: blur(3px) sepia(0.1);
}

.overlay h2 {
  font-size: 25px;
}

.overlay span {
  font-size: 22px;
}
</style>
