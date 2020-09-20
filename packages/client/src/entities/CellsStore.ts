import { observable, action } from 'mobx';
import range from 'lodash/fp/range'

export enum ECellType {
    empty,
    withShip,
    missed,
    hitted,
    killed
}

export enum ECellTurnType {
    missed,
    hitted,
    killed
}

export const getECellType = (type: ECellTurnType) => {
    switch (type){
        case ECellTurnType.missed:
            return ECellType.missed
        case ECellTurnType.hitted:
            return ECellType.hitted
        case ECellTurnType.killed:
            return ECellType.killed
    }
}

export type TCells = ECellType[][]

export class CellsStore {
    @observable private cells: TCells;

    constructor(cells: TCells) {
        this.cells = cells;
    }

    static makeInitial() {
        return new CellsStore(range(0, 10).map(() =>
            range(0, 10).map(() => ECellType.empty)
        ));
    }

    @action
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