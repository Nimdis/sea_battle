import cloneDeep from 'lodash/fp/cloneDeep'
import range from 'lodash/fp/range'
import { observable, action } from 'mobx';


export enum ECellType {
    empty,
    withShip,
    missed,
    hitted
}

export class EField {
    static makeInitialField() {
        return new EField(range(0, 10).map(() =>
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

    setCells(cells: ECellType[][]){
        this.cells = cells
    }

    clone() {
        return new EField(cloneDeep(this.getCells()))
    }

}

export const field = EField.makeInitialField()