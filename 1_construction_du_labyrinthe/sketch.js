let cols, rows;
let w = 10;
let grid = [];

let current;

let stack = [];

function setup() {
    createCanvas(400, 400);
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
}

function index(i, j) {
    if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
        return - 1;
    }

    return i + j * rows;
}

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.visited = false;

    this.checkNeighbors = function () {
        let neighbors = [];

        let top    = grid[index(i, j -1)];
        let right  = grid[index(i +1, j)];
        let bottom = grid[index(i, j +1)];
        let left   = grid[index(i -1, j)];

        if (top && !top.visited) {
            neighbors.push(top);
        }
        if (right && !right.visited) {
            neighbors.push(right);
        }
        if (bottom && !bottom.visited) {
            neighbors.push(bottom);
        }
        if (left && !left.visited) {
            neighbors.push(left);
        }

        if (neighbors.length > 0) {
            let r = Math.floor(random(0, neighbors.length));
            return neighbors[r];
        } else {
            return undefined;
        }

    }

    this.highlight = function () {
        let x = this.i * w;
        let y = this.j * w;
        noStroke();
        fill(0, 0, 255, 100);
        rect(x, y, w, w);
    }

    this.show = function () {
        let x = this.i * w;
        let y = this.j * w;
        stroke(255);
        if (this.walls[0]) {
            line(x, y, x + w, y);
        }
        if (this.walls[1]) {
            line(x + w, y, x + w, y + w);
        }
        if (this.walls[2]) {
            line(x + w, y + w, x, y + w);
        }
        if (this.walls[3]) {
            line(x, y + w, x, y);
        }

        if (this.visited) {
            noStroke();
            fill(255, 0, 255, 100);
            rect(x, y, w, w);
        }
    }


}






function removeWalls(cellA, cellB) {

    let x = cellA.i - cellB.i;
    if (x === 1) {
        cellA.walls[3] = false;
        cellB.walls[1] = false;
    } else if (x === -1) {
        cellA.walls[1] = false;
        cellB.walls[3] = false;
    }
    let y = cellA.j - cellB.j;
    if (y === 1) {
        cellA.walls[0] = false;
        cellB.walls[2] = false;
    } else if (y === -1) {
        cellA.walls[2] = false;
        cellB.walls[0] = false;
    }
}