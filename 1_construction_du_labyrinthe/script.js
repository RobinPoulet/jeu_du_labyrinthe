// Liste de tous les labyrinthes
// console.log(jsonDatas);

// Labyrinthe de taille 3x3 : ex-0
// console.log(jsonDatasBis[3]["ex-0"]);

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let size = 0;

let mazeSize = document.getElementById("mazeSize").value;
let mazeEx = document.getElementById("mazeExemple").value;
// let maze = jsonDatasBis[mazeSize][mazeEx];

// événement qui génére la création du labyrinthe
document.querySelector("#mazeGenerate").addEventListener('click', function () {
    mazeSize = document.getElementById("mazeSize").value;
    mazeEx = document.getElementById("mazeExemple").value;
    size = configCellSize(mazeSize);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze(jsonDatasBis[mazeSize][mazeEx]);
    dfs(jsonDatasBis[mazeSize][mazeEx], 0);

})

// je crée une fonction qui détermine la taille de mes cases en fonctions de la taille du labyrinthe
function configCellSize(mazeSize) {
    return canvas.width / mazeSize;
}

// je crée une fonction pour dessiner une ligne dans le canvas
function drawLine(startX, startY, endX, endY) {
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
}

// je crée une fonction pour dessiner une case du labyrinthe avec la fonction drawLine pour les bordures
function drawCell(x, y, walls) {
    let top = walls[0];
    let right = walls[1];
    let bottom = walls[2];
    let left = walls[3];

    ctx.beginPath();
    if (top) {
        drawLine(x, y, x + size, y);
    }
    if (right) {
        drawLine(x + size, y, x + size, y + size);
    }
    if (bottom) {
        drawLine(x + size, y + size, x, y + size);
    }
    if (left) {
        drawLine(x, y + size, x, y);
    }
    ctx.stroke();
}

function drawStart() {
    ctx.beginPath();
    ctx.fillStyle = '#FFA500';
    ctx.fillRect(0, 0, size / 2, size / 2);
}

function drawExit() {
    ctx.beginPath();
    ctx.fillStyle = '#008000';
    ctx.fillRect((mazeSize * size) - size / 2, (mazeSize * size) - size / 2, size / 2, size / 2);
}

function drawMaze(maze) {
    maze.forEach(function (cell) {
        cell.visited = false;
        drawCell(cell.posX * size, cell.posY * size, cell.walls);
        // console.log(cell);
    });
    drawStart();
    drawExit();
}

class Stack {
    constructor() {
        this.stack = [];
    }

    empty() {
        return this.stack.length === 0;
    }

    push(item) {
        this.stack.push(item);
    }

    pop() {
        return this.stack.pop()
    }
}

function whoIsNeighbours(pos, maze) {
    let allNeighboursPos = [];

    if (!maze[pos].walls[0]) {
        allNeighboursPos.push(pos -  parseInt(mazeSize));
    }
    if (!maze[pos].walls[1]) {
        allNeighboursPos.push(pos + 1);
    }
    if (!maze[pos].walls[2]) {
        allNeighboursPos.push(pos + parseInt(mazeSize));
    }
    if (!maze[pos].walls[3]) {
        allNeighboursPos.push(pos - 1);
    }
    return allNeighboursPos;
}


function dfs(maze, start) {
    // je crée le stack et met le noeud de départ dedans
    let stack = new Stack();
   stack.push(start);
   // tant qu'il reste un noeud dans le stack je continue
   while (!stack.empty()) {

       let curPos = stack.pop();
       console.log(curPos);
       maze[curPos].visited = true;
       console.log('je suis passé case : ' + curPos);

       // C'est gagné si je suis arrivé à la fin
       if (curPos === mazeSize * mazeSize - 1) {
           console.log("Gagné bravo !!!");
       }
       // Je regarde les voision non visités dans l'ordre (Haut, Droite, Bas, Gauche),
       // je marque le parent, comme visité et je l'ajoute au stack
       let neighboors = whoIsNeighbours(curPos, maze);
       for (let i = 0; i < neighboors.length; i++) {
           if (!maze[neighboors[i]].visited) {
                // console.log(neighboors);
               maze[neighboors[i]].parents = maze[curPos];
               stack.push(neighboors[i]);
               // console.log(maze);
           }

       }
   }

}





