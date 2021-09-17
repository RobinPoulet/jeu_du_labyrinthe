// je définis mes variables globales
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let caseSize;
let maze;
let x = 0;
let interval;

// je crée deux variables pour récupérer les inputs pour afficher un labyrinthe choisi
let mazeSize = document.getElementById("mazeSize").value;
let mazeEx = document.getElementById("mazeExemple").value;

// je crée une fonction qui détermine la taille de mes cases en fonctions de la taille du labyrinthe
function configCellSize(mazeSize) {
    return canvas.width / mazeSize;
}

// je crée un événement qui affiche un labyrinthe quand je clique sur le bouton "générer labyrinthe"
document.querySelector("#mazeGenerate").addEventListener('click', function () {
    // je récupère la valeur de mes inputs avant affichage
    mazeSize = document.getElementById("mazeSize").value;
    mazeEx = document.getElementById("mazeExemple").value;
    // je définis la taille de mes cases en fonction de la taille du labyrinthe
    caseSize = configCellSize(mazeSize);
    // j'initialise mon canvas avant affichage du labyrinthe
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // je crée un objet de type labyrinthe avec les infos récupérées
    maze = new Maze(jsonDatasBis[mazeSize][mazeEx], caseSize);
   // j'affiche mon labyrinthe
    maze.display();
    maze.solveAstar();
});

// je crée un événement qui résoud et affiche le parcours avec l'algorithme DFS
document.querySelector('#resolutionDFS').addEventListener('click', function () {
    maze.solveDFS(0);
    interval = setInterval(draw, 50);

});

// événement qui affiche la résolution du labyrinthe avec l'algorithme BFS
document.querySelector('#resolutionBFS').addEventListener('click', function () {
    maze.solveBFS(0);
    interval = setInterval(draw, 50);
})

// événement qui reset le canvas
document.querySelector('#buttonRAS').addEventListener('click', function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
})




// fonction pour afficher la solution
function colorCell(cell, maze) {
    let x = cell.posX * caseSize;
    let y = cell.posY * caseSize;
    let w = caseSize;
    let h = caseSize;

    ctx.beginPath();

    if (maze.shortPath.includes(cell.position)) {
        ctx.fillStyle = '#8a2be2';
    } else {
        ctx.fillStyle = '#2F4F4F';
    }
   ctx.fillRect(x + 1, y + 1, w + 1, h + 1);
    drawStart();
    drawExit();
}


function draw() {
    if (x < maze.path.length) {
        colorCell(maze.mazeCells[maze.path[x]], maze);
        maze.display();
        x++;
    } else {
        x = 0;
        maze.display();
        clearInterval(interval);
    }
}

function drawStart() {

    ctx.fillStyle = '#FFA500';
    ctx.fillRect(0, 0, caseSize / 2, caseSize / 2);
}

function drawExit() {

    ctx.fillStyle = '#008000';
    ctx.fillRect(((mazeSize * caseSize) - caseSize / 2) - 2,
        ((mazeSize * caseSize) - caseSize / 2) - 2,
        caseSize / 2,
        caseSize / 2);
}