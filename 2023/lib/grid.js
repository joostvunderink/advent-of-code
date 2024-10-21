export class Coord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export const NORTH = new Coord(0, 1);
export const SOUTH = new Coord(0, -1);
export const EAST = new Coord(1, 0);
export const WEST = new Coord(-1, 0);
export const ALL_DIRECTIONS = [NORTH, EAST, SOUTH, WEST];

export class Cell {
    constructor(coord, val) {
        this.coord = coord;
        this.val = val;
    }

    toString() {
        return `(${this.coord.x}, ${this.coord.y}): ${this.val}`;
    }
}

export class Grid {
    constructor(xSize = 0, ySize = 0) {
        if (xSize > 0 && ySize > 0) {
            this.init(xSize, ySize);
        }
    }

    init(xSize, ySize) {
        this.xSize = xSize;
        this.ySize = ySize;
        this.g = [];
        for (let x = 0; x < xSize; x++) {
            let row = [];
            for (let y = 0; y < ySize; y++) {
                row.push(null);
            }
            this.g.push(row);
        }
    }

    loadFromData(data) {
        this.xSize = data[0].length;
        this.ySize = data.length;
        this.init(this.xSize, this.ySize);
        for (let y = 0; y < this.ySize; y++) {
            for (let x = 0;x < this.xSize;x++) {
                this.setXY(x, y, data[this.ySize - y - 1][x]);
            }
        }
    }

    toString() {
        let s = '';
        for (let y = 0; y < this.ySize; y++) {
            for (let x = 0;x < this.xSize;x++) {
                s += this.getXY(x, this.ySize - y - 1).val;
            }
            s += '\n';
        }
        return s;
    }

    getWidth() {
        return this.xSize;
    }
    
    getHeight() {
        return this.ySize;
    }
    
    isWithinBounds(x, y) {
        if (x == null || x == undefined || y == null || y == undefined) {
            return false;
        }
        return (x >= 0 && y >= 0 && x < this.xSize && y < this.ySize);
    }

    checkWithinBoundsXY(x, y) {
        if (!this.isWithinBounds(x, y)) {
            throw new Error(`(${x}, ${y}) is outside bounds [${this.xSize}, ${this.ySize}]`);
        }
    }
    checkWithinBounds(coord) {
        this.checkWithinBoundsXY(coord.x, coord.y);
    }

    setXY(x, y, val) {
        return this.set(new Coord(x, y), val);
    }

    set(coord, val) {
        this.checkWithinBounds(coord);
        const cell = new Cell(coord, val);
        this.g[coord.x][coord.y] = cell;
        return this;
    }

    getXY(x, y) {
        this.checkWithinBoundsXY(x, y);
        return this.g[x][y];
    }

    get(coord) {
        return this.getXY(coord.x, coord.y);
    }

    getNeighbour(coord, direction) {
        const neighbourCoord = new Coord(coord.x + direction.x, coord.y + direction.y);
        // console.log(neighbourCoord.x + ', ' + neighbourCoord.y);
        return this.get(neighbourCoord);
    }
}
