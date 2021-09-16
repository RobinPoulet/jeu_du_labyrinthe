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
    // let maze = ;
    //je casse quelques murs sur le labyrinthe
    // destroyRandomWall(maze, 3);
    //
    // console.log(maze);
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
        drawLine(x             ,              y, x + size,              y);
    }
    if (right) {
        drawLine(x + size,              y, x + size, y + size);
    }
    if (bottom) {
        drawLine(x + size, y + size,             x, y + size);
    }
    if (left) {
        drawLine(             x, y + size,             x,              y);
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
    ctx.fillRect(((mazeSize * size) - size / 2) - 2,
                 ((mazeSize * size) - size / 2) - 2,
                  size / 2,
                  size / 2);
}

function drawPos(maze, pos) {
    ctx.beginPath();
    if (maze.bestPath.includes(pos)) {
        ctx.fillStyle = '#8a2be2';
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


function dfs(maze, start, end) {
    maze.path = [];
    maze.bestPath = [];
    // je crée le stack et met le noeud de départ dedans
    let stack = [];
    stack.push(start);
    // tant qu'il reste un noeud dans le stack je continue
    while (stack.length > 0) {

        let curPos = stack.pop();
        // console.log(curPos);
        // je stock dans un tableau toutes les cases ou je suis passé
        maze.path.push(curPos);

        maze[curPos].visited = true;

        // C'est gagné si je suis arrivé à la fin
        if (curPos === end) {
            // console.log(maze.path);
            // console.log("Gagné bravo !!!");
            // Je suis arrivé je retourne le chemin le plus court

            return solutionPathRecursive(mazeSize * mazeSize - 1, jsonDatasBis[mazeSize][mazeEx]);;
        }

        // Je regarde les voisins non visités dans l'ordre (Haut, Droite, Bas, Gauche),
        // je marque le parent, comme visité et je l'ajoute au stack
       let neighbors = whoIsNeighbours(curPos, maze);

        for (let i = 0; i < neighbors.length; i++) {
            if (!maze[neighbors[i]].visited) {
                // console.log(neighbors);
                maze[neighbors[i]].parents = curPos;

                stack.push(neighbors[i]);
                // console.log(maze);
            }

        }
    }

}

// function solutionPath(pos, maze) {
//     maze.bestPath.push(pos);
//     while (maze[pos].parents !== 0) {
//         pos = maze[pos].parents;
//         maze.bestPath.push(pos);
//     }
//     maze.bestPath.push(0);
// }

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
        // console.log('c est gagné');
        return true;
    }

    // Visite du noeud courant
    maze[start].visite = true;
    maze.path.push(start);
    // console.log(start);
    // On cherche les voisins non visités
    let neighbors = whoIsNeighbours(start, maze);

    for (let i = 0; i < neighbors.length; i++) {

        if (!maze[neighbors[i]].visite) {

            maze[neighbors[i]].parents = start;

            // Appel récursif et fin si le but est atteind
            if (dfsRecursive(maze, neighbors[i], end)) {

                maze.path.push(end);

                return solutionPathRecursive(end, maze);
            }
        }
    }

    return false;
}

// je crée mon objet queue
class BGQ {
    constructor() {
        this.queue = [];
    }

    empty() {
        return this.queue.length === 0;
    }

    enQueue(item) {
        this.queue.push(item);
    }

    deQueue() {
        return this.queue.shift()
    }
}


function bfs(maze, start, end) {
    maze.path = [];
    maze.bestPath = [];
    let queue = [];
    queue.push(start);

    while (queue.length > 0) {

        let curPos = queue.shift();

        maze.path.push(curPos);
        // console.log(curPos);
        maze[curPos].visited = true;

        if (curPos === end) {
            console.log("gagné!!!");

            return  solutionPathRecursive(end, maze);
        }

        let neighbors = whoIsNeighbours(curPos, maze);

        for (let i = 0; i < neighbors.length; i++) {

            if (!maze[neighbors[i]].visited) {

                maze[neighbors[i]].parents = curPos;
                queue.push(neighbors[i]);
            }
        }
    }
}

// fonction qui detruit aléatoirement certains murs
function destroyRandomWall(maze, numberofWallToDestroy) {
    for (let i = 0; i < numberofWallToDestroy; i++) {
        let randomPosition = Math.floor(Math.random() * (maze.length - 1));
        if (maze[randomPosition].posX !==0 && maze[randomPosition].posY !==0
            && maze[randomPosition].posX !== mazeSize - 1 && maze[randomPosition].posY !== mazeSize - 1) {
            for (let i = 0; i < maze[randomPosition].walls.length; i++) {
                if (maze[randomPosition].walls[0]) {
                    maze[randomPosition].walls[0] = false;
                    maze[randomPosition + mazeSize].walls[0] = false;
                    break;
                }
                if (maze[randomPosition].walls[1]) {
                    maze[randomPosition].walls[1] = false;
                    maze[randomPosition + 1].walls[3] = false;
                    break;
                }
                if (maze[randomPosition].walls[2]) {
                    maze[randomPosition].walls[2] = false;
                    maze[randomPosition - mazeSize].walls[0] = false;
                    break;
                }
                if (maze[randomPosition].walls[3]) {
                    maze[randomPosition].walls[3] = false;
                    maze[randomPosition - 1].walls[1] = false;
                    break;
                }

                i--;

            }
        }
    }
    return maze;
}