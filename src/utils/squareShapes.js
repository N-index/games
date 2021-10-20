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

export {shapes};