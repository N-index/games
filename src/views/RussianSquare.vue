<template>
  <div
      id="russian-square"
      ref="russian-square"
      tabindex="1"
      @keydown.space="transform"
      @keydown.down="down"
      @keydown.left="left"
      @keydown.right="right"
  >
    <header class="header">
      <h1>俄罗斯方块</h1>

        <details>
          <summary>玩法</summary>
          <ul>
            <li>移动：小键盘方向键</li>
            <li>变换：空格键</li>
            <li>注意: 使用鼠标点击游戏主体，确保处于 focus 状态</li>
          </ul>
        </details>

    </header>
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
              notEmpty: number !== 0
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
            >
              <!--             {{ number }} -->
            </div>
          </div>
        </div>
        <div class="score">分数：{{ score }}</div>

        <div class="btn-group">
          <button @click="startGame">
            {{ isStart ? "重新开始" : "开始" }}
          </button>
        </div>
      </aside>
    </section>
  </div>
</template>

<script>
class Shape {
  constructor() {}
  print() {
    for (let i = 0; i < this.squares.length; i++) {
      let str = "";
      for (let j = 0; j < this.squares[0].length; j++) {
        str += this.squares[i][j];
      }
      console.log(str);
    }
    console.log("\n");
  }
  transform() {
    const result = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];

    for (let i = 0; i < this.squares.length; i++) {
      for (let j = 0; j < this.squares[0].length; j++) {
        if (this.squares[i][j] === 1) {
          const [offsetX, offsetY] = [this.origin[0] - i, this.origin[1] - j];
          result[this.origin[0] - offsetY][this.origin[1] + offsetX] = 1;
        }
      }
    }
    this.squares = result;
  }
}
class O extends Shape {
  constructor() {
    super();
    this.name = "正方形";
    this.limit = 0;
    this.squares = [
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    this.origin = [1, 1];
  }
}
class I extends Shape {
  constructor() {
    super();
    this.name = "一长条";
    this.limit = 2;
    this.squares = [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    this.origin = [1, 1];
  }
}
class Z extends Shape {
  constructor() {
    super();
    this.name = "Z形";
    this.limit = 4;
    this.squares = [
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    this.origin = [1, 1];
  }
}
class ZReverse extends Shape {
  constructor() {
    super();
    this.name = "反向Z";
    this.limit = 4;
    this.squares = [
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    this.origin = [1, 1];
  }
}
class L extends Shape {
  constructor() {
    super();
    this.name = "L形状";
    this.limit = 4;
    this.squares = [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ];
    this.origin = [1, 1];
  }
}
class LReverse extends Shape {
  constructor() {
    super();
    this.name = "反向L";
    this.limit = 4;
    this.squares = [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0]
    ];
    this.origin = [1, 1];
  }
}
class T extends Shape {
  constructor() {
    super();
    this.name = "T形状";
    this.limit = 4;
    this.squares = [
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    this.origin = [1, 1];
  }
}
const shapes = [O, I, Z, ZReverse, L, LReverse, T];

export default {
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
          [0, 0, 0, 0]
        ]
      },
      shapePos: [[]],
      origin: [1, 1],
      timer: null,
      isStart: false,
      isEnd: false
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
      const after = [];
      for (const [posX, posY] of this.shapePos) {
        const [offsetX, offsetY] = [
          this.origin[0] - posX,
          this.origin[1] - posY
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
      if (
          this.shapePos.some(([x, y]) => y <= 0 || this.squares[x][y - 1] === 1)
      )
        return;
      this.shapePos = this.shapePos.map(([x, y]) => [x, y - 1]);
      this.origin[1] -= 1;
    },
    right() {
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
        length: this.squares.length - restRows.length
      }).map(() => Array.from({ length: this.length }).fill(0));

      this.squares = [...emptyRow, ...restRows];
    },
    down() {
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
    }
  }
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
header.header h1{
  font-size: 20px;
  margin-bottom: 8px;
  text-align: center;
}
header.header ul{
  list-style: none;
  font-size: 14px;
}
section.section {
  display: flex;
  gap: 15px;
}
aside.aside {
  display: flex;
  flex-direction: column;
}
aside.aside .shape{
  background-color: #00dbde;
}
.next-shape {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.next-shape .row{
  display: flex;
  gap: 5px;
}
.next-shape .square{
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
.btn-group button{
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
  gap: 5px;
}
main.main .row{
  display: flex;
  gap: 5px;
}
main.main .square{
  width: 20px;
  height: 20px;
  background-color: #c6bfbf;
}
main.main .notEmpty{
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
.overlay h2{
  font-size: 25px;
}
.overlay span{
  font-size: 22px;
}
</style>


