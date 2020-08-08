import { CellsStore, ECellType, TCells } from './CellsStore'

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
            num: 1,
            position: {
                i, j
            },
            rotation: {
                i: 1,
                j: 0
            },
            size: 4
        };

        if (this.prevShip) {
            if (MAX_COUNT_BY_SHIP_TYPE[this.prevShip.size] >= this.prevShip.num) {
                shipDescr.size -= 1
                shipDescr.num = 1
                return
            } else {
                shipDescr.num += 1
            }
        }

        this.currentShip = new Ship(shipDescr)
        this.drawShip(this.currentShip)
    }

    deleteCurrentShip() {
        this.currentShip = undefined
        this.fieldCanvas.cleanUpCells()
    }

    updateCurrentShipPostion(i: number, j: number) {
        if (this.currentShip) {
            this.currentShip.position = { i, j }
            this.drawShip(this.currentShip)
        }
    }

    addShipByPostion(i: number, j: number) {
        this.prevShip = this.currentShip
        this.createShipByPosition(i, j)
        this.fieldCanvas.updateInitialCells()
        this.drawShip(this.currentShip!)
    }

    rotateCurrentShip() {
        if (this.currentShip) {
            this.currentShip.rotate()
            this.drawShip(this.currentShip)
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

    updateInitialCells() {
        this.initialCells = this.getCells()
    }

    cleanUpCells() {
        this.setCells(this.initialCells)
    }

}

interface IShip {
    size: TShipSize,
    position: TPosition,
    rotation: TRotation,
    num: number
}

class Ship {
    position: TPosition
    size: TShipSize
    rotation: TRotation
    num: number

    constructor({ size, position, rotation, num }: IShip) {
        this.size = size
        this.position = position
        this.rotation = rotation
        this.num = num
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

    getCells() {
        return this.shipManager.getCells()
    }

    handleMouseOver(i: number, j: number) {
        this.shipManager.upsertShipByPosition(i, j)
    }

    handleMouseLeave() {
        this.shipManager.deleteCurrentShip()
    }

    handleClick(i: number, j: number) {
        this.shipManager.addShipByPostion(i, j)
    }

    handleRotate() {
        this.shipManager.rotateCurrentShip()
    }
}