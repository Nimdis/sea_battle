import { FieldCanvas } from './FieldStore'
import { ECellType, TCells } from './CellsStore'

export type TPosition = {
    i: number
    j: number
}

type TRotation = 0 | 1

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

export class ShipManager {
    private fieldCanvas: FieldCanvas
    private currentShip?: Ship
    private prevShip?: Ship

    constructor(cells: TCells) {
        this.fieldCanvas = new FieldCanvas(cells)
    }

    getCells() {
        return this.fieldCanvas.getCells()
    }

    setCell(i: number, j: number, type: ECellType) {
        this.fieldCanvas.setCell(i, j, type)
    }

    setCells(cells: TCells) {
        this.fieldCanvas.setCells(cells)
    }

    upsertShipByPosition(i: number, j: number) {
        if (this.currentShip) {
            return this.updateCurrentShipPosition(i, j)
        }
        this.createShipByPosition(i, j)
    }

    createShipByPosition(i: number, j: number) {
        const shipDescr: IShip = {
            num: this.prevShip ? this.prevShip.num : 1,
            position: {
                i,
                j,
            },
            rotation: 0,
            size: this.prevShip ? this.prevShip.size : 4,
        }

        if (this.prevShip) {
            if (
                MAX_COUNT_BY_SHIP_TYPE[this.prevShip.size] === this.prevShip.num
            ) {
                shipDescr.size -= 1
                shipDescr.num = 1
            } else {
                shipDescr.num += 1
            }
        }
        this.currentShip = new Ship(shipDescr)
        this.drawShip(this.currentShip)
    }

    leaveCurrentShip() {
        if (this.currentShip) {
            this.currentShip.position = undefined
        }
        this.fieldCanvas.cleanUpCells()
    }

    updateCurrentShipPosition(i: number, j: number) {
        if (this.currentShip) {
            this.currentShip.position = { i, j }
            this.drawShip(this.currentShip)
        }
    }

    addShipByPosition(i: number, j: number) {
        if (this.currentShip && this.currentShip.isCanPlace) {
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

    placeShips(ships: IShip[]) {
        for (const ship of ships) {
            if (this.drawShip(new Ship(ship))) {
                this.fieldCanvas.updateInitialCells()
            }
        }
    }

    private testFree(field: TCells, i: number, j: number): boolean {
        for (let x = i === 0 ? 0 : -1; x < 2 - Math.floor(i / 9); x++) {
            for (let y = j === 0 ? 0 : -1; y < 2 - Math.floor(j / 9); y++) {
                if (field[i + x][j + y] === ECellType.withShip) {
                    return false
                }
            }
        }
        return true
    }

    // TODO refactoring required
    private drawShip(ship: Ship) {
        this.fieldCanvas.cleanUpCells()
        if (!ship) {
            return false
        }
        const { size, rotation, position } = ship!
        if (!position) {
            return false
        }
        ship.isCanPlace = true
        const i: number = position.i
        const j: number = position.j
        const shift: number = Math.max(
            i * (1 - rotation) + j * rotation + size - 10,
            0
        )
        const minPoint: number = 0 - shift
        const maxPoint: number = size - shift
        for (let k = minPoint; k < maxPoint; k++) {
            const currentPoint: TPosition = {
                i: 0,
                j: 0,
            }
            currentPoint.i = i + k * (1 - rotation)
            currentPoint.j = j + k * rotation
            if (
                this.testFree(
                    this.fieldCanvas.initialCells,
                    currentPoint.i,
                    currentPoint.j
                )
            ) {
                this.fieldCanvas.setCell(
                    currentPoint.i,
                    currentPoint.j,
                    ECellType.withShip
                )
            } else {
                this.fieldCanvas.setCell(
                    currentPoint.i,
                    currentPoint.j,
                    ECellType.hitted
                )
                ship.isCanPlace = false
            }
        }
        return ship.isCanPlace
    }
}

export interface IShip {
    size: TShipSize
    position?: TPosition
    rotation: TRotation
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
        this.rotation = (1 - this.rotation) as TRotation
    }
}
