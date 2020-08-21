
export enum ECellType {
    empty,
    withShip,
    missed,
    hitted
}

export type TCells = ECellType[][]

export class CellsStore {
    private cells: TCells;

    constructor(cells: TCells) {
        this.cells = cells;
    }

    setCell(i: number, j: number, value: ECellType) {
        this.cells[i][j] = value
    }

    getCell(i: number, j: number) {
        return this.cells[i][j]
    }

    getCells() {
        return this.cells;
    }

    setCells(cells: TCells){
        this.cells = cells
    }

}