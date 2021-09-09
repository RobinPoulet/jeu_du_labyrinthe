// Liste de tous les labyrinthes
console.log(jsonDatas);

// Labyrinthe de taille 3x3 : ex-0
console.log(jsonDatas[3]["ex-0"]);

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let size = 0;

let mazeSize = document.getElementById("mazeSize").value;
let mazeEx = document.getElementById("mazeExemple").value;


// événement qui génére la création du labyrinthe
document.querySelector("#mazeGenerate").addEventListener('click', function () {
    mazeSize = document.getElementById("mazeSize").value;
    mazeEx = document.getElementById("mazeExemple").value;
    size = configCellSize(mazeSize);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze(jsonDatas[mazeSize][mazeEx]);

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
        drawCell(cell.posY * size, cell.posX * size, cell.walls);
    });
    drawStart();
    drawExit();
}

// drawMaze(jsonDatas[15]["ex-1"]);



