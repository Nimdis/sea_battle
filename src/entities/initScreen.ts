import { observable, action } from 'mobx'
import { FieldStore } from './field'
import { CellsStore, ECellType, TCells } from './CellsStore'
import { Field } from '../components/Field'

export type TPosition = {
    i: number
    j: number
}

type TRotation {
    i: 0 | 1
    j: 0 | 1
}

export type TShipSize = 1 | 2 | 3 | 4

export interface ICurrentShip {
    position?: TPosition
    size: TShipSize
    rotation: TPosition
}

const i = 0
const j = 0

const MAX_COUNT_BY_SHIP_TYPE = {
  4: 1,
  3: 2,
  2: 3,
  1: 4,
}

class ShipManager {
    fieldCanvas: FieldCanvas
    currentShip?: Ship
    prevShip?: Ship

    constructor(cells: TCells) {
        this.fieldCanvas = new FieldCanvas(cells)
    }

    createShipByPosition(i: number, j: number) {

    }

    deleteCurrentShip() {

    }

    addShipByPostion(i: number, j: number) {

    }

    updateShipSizeAndNumber() {
        if (this.lastShipSize) {
            if (MAX_COUNT_BY_SHIP_TYPE[this.lastShipSize] >= this.shipNumber) {
                this.lastShipSize -= 1
                this.shipNumber = 0
                return
            }
            this.shipNumber += 1
            return
        }
        this.lastShipSize = 4
    }

    placeCurrentShipByPosition() {
        this.currentShip = {
            position: { i, j },
            size: this.lastShipSize!,
            rotation: {
                i: 1,
                j: 0
            }
        }
        this.drawShip()
    }

    addNextShipByPosition(i: number, j: number) {
        this.updateShipSizeAndNumber()
        this.currentShip = {
            position: { i, j },
            size: this.lastShipSize!,
            rotation: {
                i: 1,
                j: 0
            }
        }
        this.drawShip()
    }

    rotateShip() {
        if (this.currentShip) {
            this.currentShip.rotation.i = 1 - this.currentShip.rotation.i
            this.currentShip.rotation.j = 1 - this.currentShip.rotation.j
            this.drawShip()
        }
    }

    private drawShip(ship: Ship) {
        if (!this.currentShip) {
            return
        }
        const { size, rotation, position } = this.currentShip!
        if (!position) {
            return
        }
        const { i, j } = position;
        const minPoint: number = 0
        const maxPoint: number = size
        for (let k = minPoint; k <= maxPoint; k++) {
            const currentPoint: TPosition = {
                i: 0,
                j: 0
            }
            if (k + rotation.i * i > 9 || k + rotation.j * j > 9) {
                currentPoint.i = rotation.j * i + rotation.i * (9 - k + minPoint)
                currentPoint.j = (9 - k + minPoint) * rotation.j + j * rotation.i
                this.fieldCanvas.setCell(currentPoint.i, currentPoint.j, ECellType.withShip)
            } else if (k + rotation.i < 0 || k + rotation.j < 0) {
                currentPoint.i = i * rotation.j + rotation.i * (Math.abs(k) + maxPoint)
                currentPoint.j = (Math.abs(k) + maxPoint) * rotation.j + rotation.i * j
                this.fieldCanvas.setCell(currentPoint.i, currentPoint.j, ECellType.withShip)
            } else {
                currentPoint.i = i + k * rotation.i
                currentPoint.j = j + k * rotation.j
                this.fieldCanvas.setCell(currentPoint.i, currentPoint.j, ECellType.withShip)
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

    cleanUpCells() {
        this.setCells(this.initialCells)
    }

}

class Ship {
    position: TPosition
    size: TShipSize
    rotation: TRotation
    num: number

    constructor({ size, position, rotation, num }: {
        size: TShipSize, 
        position: TPosition, 
        rotation: TRotation, 
        num: number
    }) {
        this.size = size
        this.position = position
        this.rotation = rotation
        this.num = num
    }
}

// 1. Mouse in = create current ship + place it
// 2. Move over = change current ship position + redraw
// 3. Mouse leave = delete current ship

export class InitScreenStore {
    shipManager: ShipManager

    constructor(cells: TCells) {
        this.shipManager = new ShipManager(cells)
    }

    // private testFree(filed: FieldStore, point: TPosition): boolean {
    //     for (let i = point.i == 0 ? 0 : -1; i < 2 - Math.floor(point.i / 9); i++) {
    //         for (let j = point.i == 0 ? 0 : -1; j < 2 - Math.floor(point.i / 9); j++) {
    //             if (filed.getCell(point.i + i, point.j + j) == ECellType.withShip) {
    //                 return true
    //             }
    //         }
    //     }
    //     return false
    // }

    handleMouseOver(i: number, j: number) {
        this.cleanUpCells()
        this.addNextShipByPosition(i, j);
    }
}