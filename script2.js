// je définis mes variables globales
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let caseSize;
let maze;
let x = 0;
let interval;
let resolveSecondMaze = false;
let newmaze = JSON.parse(sessionStorage.getItem("grId"));

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
    resolveSecondMaze = false;
    // je crée un objet de type labyrinthe avec les infos récupérées
    maze = new Maze(jsonDatasBis[mazeSize][mazeEx], caseSize);
    // j'affiche mon labyrinthe
    maze.display();
    drawStart();
    drawExit();
});

// je crée un événement pour afficher le labyrinthe crée par le génrateur
document.querySelector("#solver2").addEventListener('click', function() {

    newmaze.forEach(cell => cell.visited = false);
    mazeSize = 10;
    caseSize = configCellSize(mazeSize);
    resolveSecondMaze = true;
    maze = new Maze(newmaze, caseSize);
    maze.display();
    drawStart();
    drawExit();

})

// je crée un événement qui résoud et affiche le parcours avec l'algorithme DFS
document.querySelector('#resolutionDFS').addEventListener('click', function () {

    maze = clearCanvas();
    maze.solveDFS(0);
    interval = setInterval(draw, 50);

    createElementDisplayPathLenght(maze, 'DFS recursive');

});

// événement qui affiche la résolution du labyrinthe avec l'algorithme BFS
document.querySelector('#resolutionBFS').addEventListener('click', function () {
    maze = clearCanvas();
    maze.solveBFS(0);
    interval = setInterval(draw, 50);

    createElementDisplayPathLenght(maze, 'BFS');
})

// événement qui affiche la résolution du labyrinthe avec l'algorithme A*
document.querySelector('#resolutionAStar').addEventListener('click', function () {
    maze = clearCanvas();
    maze.solveAstar();
    interval = setInterval(draw, 50);

    createElementDisplayPathLenght(maze, 'A*');
})

// événement qui reset le canvas
document.querySelector('#buttonRAS').addEventListener('click', function () {
    removeDisplayPathLenght();
    clearCanvas();

})


// fonction qui crée un élément pour afficher la taille du chemin
function createElementDisplayPathLenght(maze, algo) {
    let tr = document.createElement('tr');
    let tdAlgoName = document.createElement('td');
    tdAlgoName.innerHTML = algo;
    tr.appendChild(tdAlgoName);
    let tdPath = document.createElement('td');
    tdPath.innerHTML = ' ' + maze.path.length + ' cases';
    tr.appendChild(tdPath);
    let tdShortPath = document.createElement('td');
    tdShortPath.innerHTML = ' ' + maze.shortPath.length + ' cases';
    tr.appendChild(tdShortPath);
    let tbody = document.getElementById('tableCompaAlgos')
    tbody.appendChild(tr);
}

// fonction pour effacer l'élement créer au-dessus
function removeDisplayPathLenght() {
    let element = document.getElementById('tableCompaAlgos');
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// fonction pour reset l'écran avant affichage
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    maze.path = [];
    maze.shortPath = [];
    if (resolveSecondMaze) {
        return new Maze(newmaze, caseSize);
    } else {
    return new Maze(jsonDatasBis[mazeSize][mazeEx], caseSize);
    }
}


// fonction pour afficher la solution
function colorCell(cell, maze) {
    let x = cell.posX * caseSize;
    let y = cell.posY * caseSize;

    ctx.beginPath();

    if (maze.shortPath.includes(cell.position)) {
        ctx.fillStyle = '#8a2be2';
    } else {
        ctx.fillStyle = '#2F4F4F';
    }
    ctx.fillRect(x, y, caseSize + 1, caseSize + 1);
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



