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

        const OFFSETS = [
            {Sx : x                , Sy : y                , Ex : x + this.cellSize, Ey : y },
            {Sx : x + this.cellSize, Sy : y                , Ex : x + this.cellSize, Ey : y + this.cellSize},
            {Sx : x + this.cellSize, Sy : y + this.cellSize, Ex : x                , Ey : y + this.cellSize},
            {Sx: x                 , Sy : y + this.cellSize, Ex : x                , Ey : y}
        ]

        ctx.beginPath();

        OFFSETS.forEach((wallCoord, i) => {
            if(this.walls[i]) {
                this.drawLine(wallCoord.Sx, wallCoord.Sy, wallCoord.Ex, wallCoord.Ey)
            }
        })

        ctx.strokeStyle = "#F00020";
        ctx.stroke();
    }

    drawLine(startX, startY, endX, endY) {

        ctx.lineWidth = 3;

        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
    }

}