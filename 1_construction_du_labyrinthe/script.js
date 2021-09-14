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

// événement qui affiche la résolution du labyrinthe avec l'algorithme DFS itératif
document.querySelector('#resolutionDFS').addEventListener('click', function () {
    // j'applique l'algorithme DFS pour récupérer le path de sortie
    // dfs(jsonDatasBis[mazeSize][mazeEx], 0);

    let maze = jsonDatasBis[mazeSize][mazeEx];
    maze.path = [];
    maze.bestPath = [];
    dfsRecursive(maze, 0, mazeSize * mazeSize - 1);

    // j'affiche le path de sortie avec ma fonction draw
    interval = setInterval(draw, 50);
})

// événement qui affiche la résolution du labyrinthe avec l'algorithme BFS
document.querySelector('#resolutionBFS').addEventListener('click', function () {
    bfs(jsonDatasBis[mazeSize][mazeEx], 0, mazeSize * mazeSize - 1);
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
    ctx.lineWidth = 7;
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
    if (maze.bestPath.includes(pos)) {
        ctx.fillStyle = '#6600cc';
    } else {
        ctx.fillStyle = '#2F4F4F';
    }

    let x = (maze[pos].posX * size) + 3;
    let y = (maze[pos].posY * size) + 3;
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
    maze.bestPath = [];
    // je crée le stack et met le noeud de départ dedans
    let stack = new Stack();
    stack.push(start);
    // tant qu'il reste un noeud dans le stack je continue
    while (!stack.empty()) {

        let curPos = stack.pop();
        console.log(curPos);
        maze.path.push(curPos);

        maze[curPos].visited = true;

        console.log('je suis passé case : ' + curPos);

        // C'est gagné si je suis arrivé à la fin
        if (curPos === mazeSize * mazeSize - 1) {
            console.log(maze.path);
            console.log("Gagné bravo !!!");
            solutionPathRecursive(mazeSize * mazeSize - 1, jsonDatasBis[mazeSize][mazeEx]);
            return maze.path;
        }

        // Je regarde les voisins non visités dans l'ordre (Haut, Droite, Bas, Gauche),
        // je marque le parent, comme visité et je l'ajoute au stack
        neighboors = whoIsNeighbours(curPos, maze);

        for (let i = 0; i < neighboors.length; i++) {
            if (!maze[neighboors[i]].visited) {
                // console.log(neighboors);
                maze[neighboors[i]].parents = curPos;

                stack.push(neighboors[i]);
                // console.log(maze);
            }

        }
    }

}

function solutionPath(pos, maze) {
    maze.bestPath.push(pos);
    while (maze[pos].parents !== 0) {
        pos = maze[pos].parents;
        maze.bestPath.push(pos);
    }
    maze.bestPath.push(0);
}

function solutionPathRecursive(pos, maze) {
    maze.bestPath.push(pos);
    if (pos === 0) {
        maze.bestPath.push(0);
        return maze.bestPath;
    } else {
        solutionPathRecursive(maze[pos].parents, maze);
    }
}

// function dfsRecursive(start, maze, path = new Set()) {
//     console.log(start);
//
//     path.add(start);
//
//
//     const neighboors = whoIsNeighbours(start, maze);
//
//     for (const neighboor of neighboors) {
//         if (neighboor === mazeSize * mazeSize -1) {
//             path.add(neighboor);
//             console.log('you found the exit');
//             maze.path = Array.from(path);
//             return maze.path;
//         }
//
//         if (!path.has(neighboor)) {
//             dfsRecursive(neighboor, maze, path);
//         }
//     }
// }

function dfsRecursive(maze, start, end) {
    // Terminé si le but est atteinds
    if (start === end) {
        console.log('c est gagné');
        return true;
    }

    // Visite du noeud courant
    maze[start].visite = true;
    maze.path.push(start);
    console.log(start);
    // On cherche les voisins non visités
    let neighboors = whoIsNeighbours(start, maze);

    for (let i = 0; i < neighboors.length; i++) {
        if (!maze[neighboors[i]].visite) {
            maze[neighboors[i]].parents = start;

            // Appel récursif et fin si le but est atteind
            if (dfsRecursive(maze, neighboors[i], end)) {
                maze.path.push(end);
                solutionPathRecursive(end, maze);
                return true;
            }
        }
    }

    return false;
}

// Création d'une classe Queue
class Queue {

    constructor() {
        this.s1 = [];
        this.s2 = [];
    }

    enQueue(x) {
        // déplacer tous les éléments de s1 à s2
        while (this.s1.length !== 0) {
            this.s2.push(this.s1.pop());
            //s1.pop();
        }

        // Push l'item dans s1
        this.s1.push(x);

        // Push tout ce qu'il reste dans s1
        while (this.s2.length !== 0) {
            this.s1.push(this.s2.pop());
            //s2.pop();
        }
    }

    // Dequeue un élément de la queue
    deQueue() {

        // Si s1 est vide
        if (this.s1.length === 0) {
            console.log("Q is empty");
        }

        // Return le premier élément de s1
        let x = this.s1[this.s1.length - 1];
        this.s1.pop();
        return x;
    }

    empty() {
        return this.s1.length === 0;
    }
}

function bfs(maze, start, end) {
    maze.path = [];
    maze.bestPath = [];
    let Q = new Queue();
    Q.enQueue(start);

    while (!Q.empty()) {
        let curPos = Q.deQueue();
        maze.path.push(curPos);
        console.log(curPos);
        maze[curPos].visited = true;
        if (curPos === end) {
            console.log("gagné!!!");
            solutionPathRecursive(end, maze);
            return maze.path;
        }

        let neighboors = whoIsNeighbours(curPos, maze);

        for (let i = 0; i < neighboors.length; i++) {
            if (!maze[neighboors[i]].visited) {
                maze[neighboors[i]].parents = curPos;
                Q.enQueue(neighboors[i]);
            }
        }
    }
}


