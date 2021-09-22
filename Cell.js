class Cell {
    constructor(description, index, cellSize) {
        this.posX = description.posX;
        this.posY = description.posY;
        this.walls = description.walls;
        this.position = index;
        this.cellSize = cellSize;
        this.parents = null;
    }

    drawCell() {
        let x = this.posX * this.cellSize;
        let y = this.posY * this.cellSize;
        let top = this.walls[0];
        let right = this.walls[1];
        let bottom = this.walls[2];
        let left = this.walls[3];

        ctx.beginPath();
        if (top) {
            this.drawLine(x, y, x + this.cellSize, y);
        }
        if (right) {
            this.drawLine(x + this.cellSize, y, x + this.cellSize, y + this.cellSize);
        }
        if (bottom) {
            this.drawLine(x + this.cellSize, y + this.cellSize, x, y + this.cellSize);
        }
        if (left) {
            this.drawLine(x, y + this.cellSize, x, y);
        }
        ctx.strokeStyle = "#F00020";
        ctx.stroke();
    }

    drawLine(startX, startY, endX, endY) {

        ctx.lineWidth = 3;

        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
    }

}