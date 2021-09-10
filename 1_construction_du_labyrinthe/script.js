// Liste de tous les labyrinthes
// console.log(jsonDatas);

// Labyrinthe de taille 3x3 : ex-0
// console.log(jsonDatasBis[3]["ex-0"]);

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let size = 0;
let x = 0;

let mazeSize = document.getElementById("mazeSize").value;
let mazeEx = document.getElementById("mazeExemple").value;
let drawShortPath = false;



// événement qui génére la création du labyrinthe
document.querySelector("#mazeGenerate").addEventListener('click', function () {
    mazeSize = document.getElementById("mazeSize").value;
    mazeEx = document.getElementById("mazeExemple").value;

    function draw() {
        drawPos(jsonDatasBis[mazeSize][mazeEx],  jsonDatasBis[mazeSize][mazeEx].path[x]);
        if (x < jsonDatasBis[mazeSize][mazeEx].path.length) {
            x++;
        } else {
            x = 0;
        }
    }

    size = configCellSize(mazeSize);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze(jsonDatasBis[mazeSize][mazeEx]);
    recursive_DFS(jsonDatasBis[mazeSize][mazeEx], 0, mazeSize * mazeSize - 1);


    // let interval = setInterval(draw, 50);


})

// je crée une fonction qui détermine la taille de mes cases en fonctions de la taille du labyrinthe
function configCellSize(mazeSize) {
    return canvas.width / mazeSize;
}


// fonction d'affichage

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
    if (drawShortPath) {
        ctx.fillStyle = '#E7A854';
    } else {
        ctx.fillStyle = '#AFEEEE';
    }
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

    if (!maze[pos].walls[0] && !maze[pos - parseInt(mazeSize)].visited) {

        allNeighboursPos.push(pos - parseInt(mazeSize));

    }
    if (!maze[pos].walls[1] && !maze[pos + 1].visited) {

        allNeighboursPos.push(pos + 1);

    }
    if (!maze[pos].walls[2] && !maze[pos + parseInt(mazeSize)]) {
        allNeighboursPos.push(pos + parseInt(mazeSize));
    }
    if (!maze[pos].walls[3] && !maze[pos - 1]) {
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
        // Je regarde les voision non visités dans l'ordre (Haut, Droite, Bas, Gauche),
        // je marque le parent, comme visité et je l'ajoute au stack
        let neighboors = whoIsNeighbours(curPos, maze);

        if (neighboors.length < 2 && curPos !==0) {
            maze.goBack = true;
            maze.path.pop();
            console.log("je pop");
        }

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
        if(recursive_DFS(maze, neighboors[i], end)) return true;
    }

    return false;
}

 function toArrIterativeDFS(start) {
    const stack = [];
    const visited = new Set();
    const startNode = this.nodes.get(start);
    if (startNode) {
        stack.push(startNode);
    }

    while (stack.length) {
        const currNode = stack.pop();
        if (!visited.has(currNode.data)) {
            visited.add(currNode.data);

            stack.push(...Array.from(currNode.getEdges().values()).reverse());
        }
    }
    return Array.from(visited);
}

