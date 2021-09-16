const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const mazeSize = 4;
const mazeEx = 'ex-1';
const caseSize = 400 / mazeSize;

class Maze {

    constructor(mazeDescription) {
        this.path = [];
        this.shortPath = [];
        this.mazeCells = [];
        this.currentPos = 0;
        this.lastCell = mazeDescription.length - 1;
        mazeDescription.forEach((cellDescription, index) => {
            let c = new Cell(cellDescription, index);
            this.mazeCells.push(c);
        });
    }

    display() {
        for (let cell of this.mazeCells) {
            cell.drawCell();
        }
    }

    get_neighbors(cell) {
        const neighbors = [];

        if (!cell.walls[0]) {
            neighbors.push(cell.position - mazeSize);
        }
        if (!cell.walls[1]) {
            neighbors.push(cell.position + 1);
        }
        if (!cell.walls[2]) {
            neighbors.push(cell.position + mazeSize);
        }
        if (!cell.walls[3]) {
            neighbors.push(cell.position - 1);
        }
        return neighbors;
    }


    solveDFS(position) {

        if (position === this.lastCell) {
            console.log("c'est gagné");
            return true;
        }

        let currentCell = this.mazeCells[position];
        this.path.push(currentCell.position);
        currentCell.visited = true;

        let neighboors = this.get_neighbors(currentCell);
        for (let i = 0; i < neighboors.length; i++) {
           let v = this.mazeCells[neighboors[i]];
            if (!v.visited) {
                v.parents = currentCell;
                if (this.solveDFS(v.position)) {
                    this.path.push(v.position);
                    return this.solutionPathRecursive(v.position);
                }
            }
        }
        return false;
    }

    solutionPathRecursive(pos) {
        this.shortPath.push(pos);
        if (pos === 0) {
            return this.shortPath;
        } else {
            this.solutionPathRecursive(this.mazeCells[pos].parents.position);
        }
    }

}

class Cell {
    constructor(description, index) {
        this.posX = description.posX;
        this.posY = description.posY;
        this.walls = description.walls;
        this.position = index;
        this.parents = null;
    }

    drawCell() {
        let x = this.posX * caseSize;
        let y = this.posY * caseSize;
        let top = this.walls[0];
        let right = this.walls[1];
        let bottom = this.walls[2];
        let left = this.walls[3];

        ctx.beginPath();
        if (top) {
            drawLine(x, y, x + caseSize, y);
        }
        if (right) {
            drawLine(x + caseSize, y, x + caseSize, y + caseSize);
        }
        if (bottom) {
            drawLine(x + caseSize, y + caseSize, x, y + caseSize);
        }
        if (left) {
            drawLine(x, y + caseSize, x, y);
        }
        ctx.strokeStyle = "#F00020";
        ctx.stroke();
    }

}

function drawLine(startX, startY, endX, endY) {
    ctx.lineWidth = 1;
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
}

function drawCell(cell, maze) {
    let x = cell.posX * caseSize;
    let y = cell.posY * caseSize;
    ctx.beginPath();
    if (maze.shortPath.includes(cell.position)) {
        ctx.fillStyle = '#8a2be2';
    } else {
        ctx.fillStyle = '#2F4F4F';
    }

    ctx.fillRect(x, y, caseSize - 1, caseSize - 1);
}

let newMaze = new Maze(jsonDatasBis[mazeSize][mazeEx]);
newMaze.display();
newMaze.solveDFS(0);
let x = 0;
let interval = setInterval(draw, 50);

function draw() {
    if (x < newMaze.path.length) {
        drawCell(newMaze.mazeCells[newMaze.path[x]], newMaze);
        x++;
    } else {
        x = O;
        clearInterval(interval);
    }
}