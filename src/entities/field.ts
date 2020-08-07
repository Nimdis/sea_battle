import cloneDeep from 'lodash/fp/cloneDeep'
import range from 'lodash/fp/range'
import { observable, action } from 'mobx';

export interface IField {
    cells: ECellType[][]
}

export enum ECellType {
    empty,
    withShip,
    missed,
    hitted
}

export class Field {
    static makeInitialField() {
        return new Field(range(0, 10).map(() =>
            range(0, 10).map(() => ECellType.empty)
        ));
    }

    @observable private cells: ECellType[][];

    constructor(cells: ECellType[][]) {
        this.cells = cells;
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

    clone() {
        return new Field(cloneDeep(this.getCells()))
    }
}

export const field = Field.makeInitialField()