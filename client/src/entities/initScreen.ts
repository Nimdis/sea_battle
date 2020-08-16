import { CellsStore, ECellType, TCells } from './CellsStore'
import { cloneDeep } from "lodash"

import { field } from './field'

export type TPosition = {
    i: number
    j: number
}

type TRotationUnit = 0 | 1

type TRotation = {
    i: TRotationUnit
    j: TRotationUnit
}

export type TShipSize = 1 | 2 | 3 | 4

export interface ICurrentShip {
    position?: TPosition
    size: TShipSize
    rotation: TPosition
}

const MAX_COUNT_BY_SHIP_TYPE = {
    4: 1,
    3: 2,
    2: 3,
    1: 4,
}

class ShipManager {
    private fieldCanvas: FieldCanvas
    private currentShip?: Ship
    private prevShip?: Ship

    constructor(cells: TCells) {
        this.fieldCanvas = new FieldCanvas(cells)
    }

    getCells() {
        return this.fieldCanvas.getCells()
    }

    upsertShipByPosition(i: number, j: number) {
        if (this.currentShip) {
            return this.updateCurrentShipPostion(i, j)
        }
        this.createShipByPosition(i, j)
    }

    createShipByPosition(i: number, j: number) {
        const shipDescr: IShip = {
            num: this.prevShip ? this.prevShip.num : 1,
            position: {
                i, j
            },
            rotation: {
                i: 1,
                j: 0
            },
            size: this.prevShip ? this.prevShip.size : 4
        };

        if (this.prevShip) {
            if (MAX_COUNT_BY_SHIP_TYPE[this.prevShip.size] === this.prevShip.num) {
                shipDescr.size -= 1
                shipDescr.num = 1
            } else {
                shipDescr.num += 1
            }
        }
        this.currentShip = new Ship(shipDescr)
        // TODO проверить, скорее всего оно нужно
        this.drawShip(this.currentShip)
    }

    // TODO вернуть как было, если нужно, сделать новый метод
    leaveCurrentShip() {
        if(this.currentShip){
            this.currentShip.position = undefined
        }
        this.fieldCanvas.cleanUpCells()
    }

    updateCurrentShipPostion(i: number, j: number) {
        if (this.currentShip) {
            this.currentShip.position = { i, j }
            this.drawShip(this.currentShip)
        }
    }

    addShipByPostion(i: number, j: number) {
        if(this.currentShip && this.currentShip.isCanPlace){
            this.prevShip = this.currentShip
            // TODO проверить нужно ли оно тут
            this.fieldCanvas.updateInitialCells()
            this.createShipByPosition(i, j)
        }
    }

    rotateCurrentShip() {
        if (this.currentShip) {
            this.currentShip.rotate()
            this.fieldCanvas.cleanUpCells()
            this.drawShip(this.currentShip)
        }
    }

    private testFree(filed: TCells, i: number, j: number): boolean {
        for (let x = i == 0 ? 0 : -1; x < 2 - Math.floor(i / 9); x++) {
            for (let y = i == 0 ? 0 : -1; y < 2 - Math.floor(i / 9); y++) {
                if (filed[i + x][j + y] == ECellType.withShip) {
                    return false
                }
            }
        }
        return true
    }

    // TODO refactoring required
    private drawShip(ship: Ship) {
        console.log("re")
        this.fieldCanvas.cleanUpCells()
        if (!ship) {
            return
        }
        const { size, rotation, position } = ship!
        if (!position) {
            return
        }
        ship.isCanPlace = true
        const i: number = Math.max(position.i - Math.floor((size - 1) / 2) * rotation.i, 0);
        const j: number = Math.max(position.j - Math.floor((size - 1) / 2) * rotation.j, 0);
        const shift: number = Math.max((i*rotation.i+j*rotation.j)+size-10, 0)
        const minPoint: number = 0-shift
        const maxPoint: number = size-shift
        for (let k = minPoint; k < maxPoint; k++) {
            const currentPoint: TPosition = {
                i: 0,
                j: 0
            }
            currentPoint.i = i + k * rotation.i
            currentPoint.j = j + k * rotation.j
            if(this.testFree(this.fieldCanvas.initialCells, currentPoint.i, currentPoint.j)){
                this.fieldCanvas.setCell(currentPoint.i, currentPoint.j, ECellType.withShip)
            }else{
                this.fieldCanvas.setCell(currentPoint.i, currentPoint.j, ECellType.hitted)
                ship.isCanPlace = false
            }
        }
    }
}

class FieldCanvas extends CellsStore {
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

interface IShip {
    size: TShipSize,
    position?: TPosition,
    rotation: TRotation,
    num: number
}

class Ship {
    position?: TPosition
    size: TShipSize
    rotation: TRotation
    num: number
    isCanPlace: boolean

    constructor({ size, position, rotation, num }: IShip) {
        this.size = size
        this.position = position
        this.rotation = rotation
        this.num = num
        this.isCanPlace = false
    }

    rotate() {
        this.rotation.i = (1 - this.rotation.i) as TRotationUnit
        this.rotation.j = (1 - this.rotation.j) as TRotationUnit
    }
}

// 1. Mouse in = create current ship + place it
// 2. Move over = change current ship position + redraw
// 3. Mouse leave = delete current ship

export class InitScreenStore {
    private shipManager: ShipManager

    constructor(cells: TCells) {
        this.shipManager = new ShipManager(cells)
    }


    getCells() {
        return this.shipManager.getCells()
    }

    handleMouseOver(i: number, j: number) {
        this.shipManager.upsertShipByPosition(i, j)
    }

    handleMouseLeave() {
        this.shipManager.leaveCurrentShip()
    }

    handleClick(i: number, j: number) {
        this.shipManager.addShipByPostion(i, j)
    }

    handleRotate() {
        this.shipManager.rotateCurrentShip()
    }
}

export const initScreen = new InitScreenStore(field.cloneCells())