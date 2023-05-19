// déclaration de mes variables globales
const mazeSize = 15;
const canvasSize = 500;
const caseSize = canvasSize / mazeSize;
let current;
let stack = [];
const maze = jsonDatasBis[15]['ex-1'];
const end = maze.length - 1;

// fonction setup
function setup() {
    createCanvas(canvasSize, canvasSize);
    background(51);
    maze.forEach(element => show(element));
    current = 0;
}

// fonction draw résolution avec algorithme DFS
function draw() {

    maze[current].visited = true;
    highlight(current);
    console.log(current);
    colorateMazeCaseVisited(current);
    stack.push(current);

    if (current === end) {
        console.log("gagné");
    }

    current = stack.pop();

    let neighboors = checkNeighbors(current);
    for (let i = 0; i < neighboors.length; i++) {
        if (!maze[neighboors[i]].visited) {

            maze[neighboors[i]].parents = current;
            stack.push(neighboors[i]);

        }
    }

}


// fonction d'affichage du labyrinthe
function show(mazeCase) {
    let x = mazeCase.posX * caseSize;
    let y = mazeCase.posY * caseSize;
    stroke (255);
    if (mazeCase.walls[0]) {
        line(x, y, x + caseSize, y);
    }
    if (mazeCase.walls[1]) {
        line(x + caseSize, y,x + caseSize, y + caseSize);
    }
    if (mazeCase.walls[2]) {
        line(x + caseSize, y + caseSize, x, y + caseSize);
    }
    if (mazeCase.walls[3]) {
        line(x, y + caseSize, x, y);
    }
}

// fonction d'affichage de la currentPos
function highlight(position) {
    let x = position.posX * caseSize;
    let y = position.posY * caseSize;
    noStroke();
    fill(0, 0, 255, 100);
    rect(x, y, caseSize, caseSize);
}

// fonction qui affiche une case visité
function colorateMazeCaseVisited(position) {
    let x = position.posX * caseSize;
    let y = position.posY * caseSize;
    noStroke();
    fill(255, 0, 255, 100);
    rect(x, y, caseSize, caseSize);
}

// fonction qui va chercher les voisins d'une case
function checkNeighbors(position) {
    let walls = maze[position].walls;
    let neighbors = [];

    if (!walls[0]) {
        neighbors.push(position - mazeSize);
    }
    if (!walls[1]) {
        neighbors.push(position + 1);
    }
    if (!walls[2]) {
        neighbors.push(position + mazeSize);
    }
    if (!walls[3]) {
        neighbors.push(position - 1);
    }
    return neighbors;
}


// fonction qui retourne le chemin le plus court en partant du parent de l'arrivée jusqu'au départ
function solutionPathRecursive(fin) {
    maze.bestPath.push(fin);
    if (fin === 0) {
        maze.bestPath.push(0);
        return maze.bestPath;
    } else {
        solutionPathRecursive(maze[fin].parents);
    }
}