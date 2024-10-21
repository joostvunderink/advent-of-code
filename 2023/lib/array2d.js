export class Array2D {
    constructor() {
        this.a = {};
    }

    set(x, y, val ) {
        if (!this.a[x]) {
            this.a[x] = {};
        }
        this.a[x][y] = val;
    }

    get(x, y) {
        if (this.a[x]) {
            return this.a[x][y];
        }
        return null;
    }
}
