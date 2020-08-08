import cloneDeep from 'lodash/fp/cloneDeep'
import range from 'lodash/fp/range'
import { CellsStore, ECellType } from './CellsStore';


export class FieldStore extends CellsStore {
    static makeInitialField() {
        return new FieldStore(range(0, 10).map(() =>
            range(0, 10).map(() => ECellType.empty)
        ));
    }

    clone() {
        return new FieldStore(cloneDeep(this.getCells()))
    }

    cloneCells() {
        return cloneDeep(this.getCells())
    }

}

export const field = FieldStore.makeInitialField()