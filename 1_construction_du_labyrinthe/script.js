// Liste de tous les labyrinthes
// console.log(jsonDatas);

// Labyrinthe de taille 3x3 : ex-0
// console.log(jsonDatasBis[3]["ex-0"]);

// je déclare mes variables blobales
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let mazeSize = document.getElementById("mazeSize").value;
let mazeEx = document.getElementById("mazeExemple").value;
let interval = null;
let size = 0;
let x = 0;



// événement qui génére la création du labyrinthe et sa résolution
document.querySelector("#mazeGenerate").addEventListener('click', function () {
    // je récupère la valeur de mes inputs avant affichage
    mazeSize = document.getElementById("mazeSize").value;
    mazeEx = document.getElementById("mazeExemple").value;
    // je définis la taille de mes cases en fonction de la taille du labyrinthe
    size = configCellSize(mazeSize);
    // j'initialise mon canvas avant affichage du labyrinthe
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // j'affiche le labyrinthe
    drawMaze(jsonDatasBis[mazeSize][mazeEx]);

})

// événement qui affiche la résolution du labyrinthe acec l'algorithme DFS itératif
document.querySelector('#resolutionDFS').addEventListener('click', function () {
    // j'applique l'algorithme DFS pour récupérer le path de sortie
    dfs(jsonDatasBis[mazeSize][mazeEx], 0);
    // j'affiche le path de sortie avec ma fonction draw
    interval = setInterval(draw, 50);
})

// événement qui reset le canvas
document.querySelector('#buttonRAS').addEventListener('click', function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
})



// fonction d'affichage

// fonction qui sert à afficher la résolution du labyrinthe
function draw() {
    drawStart();
    drawExit();

    if (x < jsonDatasBis[mazeSize][mazeEx].path.length) {
        drawPos(jsonDatasBis[mazeSize][mazeEx], jsonDatasBis[mazeSize][mazeEx].path[x]);
        x++;
    } else {
        x = 0;
        clearInterval(interval);
    }
}

// je crée une fonction qui détermine la taille de mes cases en fonctions de la taille du labyrinthe
function configCellSize(mazeSize) {
    return canvas.width / mazeSize;
}

// je crée une fonction pour dessiner une ligne dans le canvas
function drawLine(startX, startY, endX, endY) {
    ctx.lineWidth = 4;
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
    ctx.strokeStyle = "#F00020";
    ctx.stroke();
}

function drawStart() {
    ctx.beginPath();
    ctx.fillStyle = '#FFA500';
    ctx.fillRect(0 + 2, 0 + 2, size / 2, size / 2);
}

function drawExit() {
    ctx.beginPath();
    ctx.fillStyle = '#008000';
    ctx.fillRect(((mazeSize * size) - size / 2) - 2, ((mazeSize * size) - size / 2) - 2, size / 2, size / 2);
}

function drawPos(maze, pos) {
    ctx.beginPath();
    ctx.fillStyle = '#2F4F4F';

    let x = (maze[pos].posX * size) + 2;
    let y = (maze[pos].posY * size) + 2;
    let w = size - 4;
    let h = size - 4;

    if (!maze[pos].walls[0]) {
        y -= 2;
    }

    if (!maze[pos].walls[1]) {
        w += 4;
    }

    if (!maze[pos].walls[2]) {
        h += 4;
    }

    if (!maze[pos].walls[3]) {
        x -= 2;
    }

    ctx.fillRect(x, y, w, h);

}

function drawMaze(maze) {
    maze.forEach(function (cell) {
        cell.visited = false;
        drawCell(cell.posX * size, cell.posY * size, cell.walls);
        // console.log(cell);
    });
}

// fonction pour utiliser l'algorithme DFS itératif


// je crée mon objet stack
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

// fonction qui détermine les voisins d'une case
function whoIsNeighbours(pos, maze) {
    let allNeighboursPos = [];

    if (!maze[pos].walls[0]) {

        allNeighboursPos.push(pos - parseInt(mazeSize));

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
    maze.path = [];
    // je crée le stack et met le noeud de départ dedans
    let stack = new Stack();
    stack.push(start);
    // tant qu'il reste un noeud dans le stack je continue
    while (!stack.empty()) {

        let curPos = stack.pop();
        console.log(curPos);
        // drawPos(maze, curPos);

        maze.path.push(curPos);
        // maze.path.forEach(function (pos) {
        //     if (pos === curPos) {
        //         maze.path.pop();
        //     }
        // });
        maze[curPos].visited = true;
        console.log('je suis passé case : ' + curPos);

        // C'est gagné si je suis arrivé à la fin
        if (curPos === mazeSize * mazeSize - 1) {
            maze.path = Array.from(createSet(maze.path));

            console.log(maze.path);
            console.log("Gagné bravo !!!");

            return true;
        }
        // Je regarde les voisins non visités dans l'ordre (Haut, Droite, Bas, Gauche),
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

function createSet(arr) {
    return new Set(arr);
}


function recursive_DFS(start, maze) {
    // fini si on est arrivé
    if (start) {
        console.log("Gagné bravo !!!");
        return true;
    }

    // visit la position courante
    start.visited = true;
    console.log('je suis case n° : ' + start);

    // prendre les case voisines dans l'ordre
    let neighboors = whoIsNeighbours(start, maze);
    for (let i = 0; i < neighboors.length; i++) {
        neighboors[i].parent = start;

        // appel recursif and fin si le but est atteind
        if (recursive_DFS(maze, neighboors[i], end)) return true;
    }

    return false;
}

function findpath(maze, start) {
    let seenPath = new Set();

    findPathRecur(maze, start, seenPath);

    return Array.from(seenPath);
}

function findPathRecur(maze, point, seenPath) {


    if (!isValidPathPoint(maze, point, seenPath)) {
        return false;
    }

    if (point === mazeSize * mazeSize - 1) {
        seenPath.add(point);
        return true;
    }

    seenPath.add(point);

    if (findPathRecur(maze, point - mazeSize, seenPath)) {
        return true;
    }
    if (findpath(maze, point + 1, seenPath)) {
        return true;
    }
    if (findpath(maze, point + mazeSize, seenPath)) {
        return true;
    }
    if (findpath(maze, point - 1, seenPath)) {
        return true;
    }

    seenPath.delete(point);

    return false;
}

function isValidPathPoint(maze, point, seenPath) {
    if (maze[point] !== null) {

        if (!seenPath.has(point)) {
            return true;
        }
    }
    return false;
}
