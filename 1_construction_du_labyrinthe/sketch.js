let cols, rows;
let w =;
let grid = [];
let newmaze = [];
let current;

let stack = [];

function setup() {
    let ctx = createCanvas(800, 800);
    ctx.style.margin = "50px";
    cols = Math.floor(width / w);
    rows = Math.floor(width / w);
    // frameRate(5);

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            let cell = new Cell(i, j);
            grid.push(cell);
        }
    }

    current = grid[0];
}

function draw() {
    background(51);
    for (let i = 0; i < grid.length; i++) {
        grid[i].show();
    }

    current.visited = true;
    current.highlight();
    // étape 1 de l'algo
    let next = current.checkNeighbors();
    if (next) {
        next.visited = true;

        // étape 2 de l'algo
        stack.push(current);

        // étape 3 de l'algo
        removeWalls(current, next);

        // étape 4 de l'algo
        current = next;
    } else if (stack.length > 0) {
        current = stack.pop();


    }

    sessionStorage.setItem("grId", JSON.stringify(grid));

}

function index(i, j) {
    if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
        return -1;
    }

    return i + j * rows;
}

function Cell(i, j) {
    this.posX = i;
    this.posY = j;
    this.walls = [true, true, true, true];
    this.visited = false;

    this.checkNeighbors = function () {
        const OFFSETS = [
            index(i, j - 1),
            index(i + 1, j),
            index(i, j + 1),
            index(i - 1, j)
        ]

        const neighbors = [];

        OFFSETS.forEach((dir) => {
            let neighbor = grid[dir];
            if (neighbor && !neighbor.visited) {
                neighbors.push(neighbor);
            }
        })

        if (neighbors.length > 0) {
            let r = Math.floor(random(0, neighbors.length));
            return neighbors[r];
        } else {
            return undefined;
        }

    }

    this.highlight = function () {
        let x = this.posX * w;
        let y = this.posY * w;
        noStroke();
        fill(0, 0, 255, 100);
        rect(x, y, w, w);
    }

    this.show = function () {
        let x = this.posX * w;
        let y = this.posY * w;
        const OFFSETS = [
            {x: x, y: y, wi: x + w, h: y},
            {x: x + w, y: y, wi: x + w, h: y + w},
            {x: x + w, y: y + w, wi: x, h: y + w},
            {x: x, y: y + w, wi: x, h: y}
        ];
        stroke(255);
        OFFSETS.forEach((dir, index) => {
            if (this.walls[index]) {
                line(dir.x, dir.y, dir.wi, dir.h);
            }
        });

        if (this.visited) {
            noStroke();
            fill(0, 255, 255, 100);
            rect(x, y, w, w);
        }
    }


}


function removeWalls(cellA, cellB) {


    const OFFSETS = [
        {x: 1, y: 0, a: 3, b: 1},
        {x: -1, y: 0, a: 0, b: 2},
        {x: 0, y: 1, a: -2, b: 0},
        {x: 0, y: -1, a: -1, b: -3}
    ];

    OFFSETS.forEach((dir, i) => {
        if (cellA.posX - cellB.posX === dir.x && cellA.posY - cellB.posY === dir.y) {
            cellA.walls[i + dir.a] = false;
            cellB.walls[i + dir.b] = false;
        }
    })
}

