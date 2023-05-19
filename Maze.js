class Maze {

    constructor(mazeDescription, cellSize) {
        this.path = [];
        this.shortPath = [];
        this.mazeCells = [];
        this.currentPos = 0;
        this.lastCell = mazeDescription.length - 1;
        this.cellSize = cellSize;

        mazeDescription.forEach((cellDescription, index) => {
            let c = new Cell(cellDescription, index, this.cellSize);
            this.mazeCells.push(c);
        });
    }

    display() {

        this.mazeCells.forEach(cell => cell.drawCell());

    }

    get_neighbors(cell) {

        const OFFSETS = [
            cell.position - parseInt(mazeSize),
            cell.position + 1,
            cell.position + parseInt(mazeSize),
            cell.position - 1
        ];

        const neighbors = [];

        OFFSETS.forEach((dir, index) => {
            if (!cell.walls[index]) {
                neighbors.push(dir);
            }
        })

        return neighbors;
    }


    solveDFS(position) {

        if (position === this.lastCell) {
            console.log("c'est gagné");
            this.path.push(position);
            this.solutionPathRecursive(position);
            return true;
        }

        let currentCell = this.mazeCells[position];
        this.path.push(currentCell.position);
        currentCell.visited = true;

        let neighboors = this.get_neighbors(currentCell);
        for (let i = 0; i < neighboors.length; i++) {
            let v = this.mazeCells[neighboors[i]];
            if (!v.visited) {
                v.parents = currentCell;
                if (this.solveDFS(v.position)) {
                    // this.path.push(v.position);
                    return true;
                }
            }
        }
        return false;
    }

    solutionPathRecursive(pos) {

        this.shortPath.push(pos);
        if (pos === 0) {
            return this.shortPath;
        } else {
            this.solutionPathRecursive(this.mazeCells[pos].parents.position);
        }
    }

    solveBFS(pos) {
        let queue = [];
        queue.push(pos);

       while (queue.length > 0) {

           let curPos = queue.shift();

           this.path.push(curPos);

           this.mazeCells[curPos].visited = true;

           if (curPos === this.lastCell) {

               console.log("gagné!!!")

               return this.solutionPathRecursive(curPos);

           }

           let neighbors = this.get_neighbors(this.mazeCells[curPos]);

           for (let i = 0; i < neighbors.length; i++) {

               if (!this.mazeCells[neighbors[i]].visited) {

                   this.mazeCells[neighbors[i]].parents = this.mazeCells[curPos];
                   queue.push(neighbors[i]);
               }

           }

       }

    }

    heuristicCost(cell) {
        return (this.mazeCells[this.lastCell].posX - cell.posX) + (this.mazeCells[this.lastCell].posY - cell.posY)
    }

    solveAstar() {
        let queue = [];
        let currentCell = this.mazeCells[0]

        queue.push(currentCell);

        while (queue.length > 0) {
            // je trie mon tableau par odre de cout croissant avant de shift le premier élément
            // de manière à avoir l'élément avec le cout le plus bas
            queue.sort(function (a, b) {
                return a.cost - b.cost;
            })

            currentCell = queue.shift()
            this.path.push(currentCell.position);
            currentCell.visited = true;
            console.log(currentCell.position);

            if (currentCell.position === this.lastCell) {

                console.log("c'est gagné");
                return this.solutionPathRecursive(currentCell.position);

            }

            let voisins = this.get_neighbors(currentCell);
            for (let voisin of voisins) {
                if (!this.mazeCells[voisin].visited) {
                    this.mazeCells[voisin].cost = this.heuristicCost(this.mazeCells[voisin]);
                    this.mazeCells[voisin].parents = currentCell;
                    queue.push(this.mazeCells[voisin]);

                }
            }

        }

    }

}


