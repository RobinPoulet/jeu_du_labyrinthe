// Liste de tous les labyrinthes
console.log(jsonDatas);

// Labyrinthe de taille 3x3 : ex-0
console.log(jsonDatas[3]["ex-0"]);

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

// je crée une fonction pour dessiner une ligne dans le canvas
function drawLine(startX, startY, endX, endY) {
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
}

// je crée une fonction pour dessiner une case du labyrinthe avec la fonction drawLine pour les bordures
function drawCell(x, y, side, walls) {
    let up = walls[0];
    let right = walls[1];
    let down = walls[2];
    let left = walls[3];
}



