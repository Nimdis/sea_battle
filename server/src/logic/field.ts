import cloneDeep from 'lodash/fp/cloneDeep'
import range from 'lodash/fp/range'
import { CellsStore, ECellType, TCells } from './CellsStore';


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
