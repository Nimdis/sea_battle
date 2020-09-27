import cloneDeep from 'lodash/fp/cloneDeep'
import { CellsStore, TCells } from './CellsStore'

export class FieldStore extends CellsStore {
    static initialize(cs: CellsStore) {
        return new FieldStore(cs.getCells())
    }

    clone() {
        return new FieldStore(cloneDeep(this.getCells()))
    }

    cloneCells() {
        return cloneDeep(this.getCells())
    }
}

export class FieldCanvas extends CellsStore {
    initialCells: TCells

    constructor(cells: TCells) {
        super(cells)
        this.initialCells = cells
    }

    updateInitialCells() {
        this.initialCells = cloneDeep(this.getCells())
    }

    cleanUpCells() {
        this.setCells(cloneDeep(this.initialCells))
    }
}
