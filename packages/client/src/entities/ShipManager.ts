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
    private ships: Ship[]

    constructor(cells: TCells) {
        this.fieldCanvas = new FieldCanvas(cells)
        this.ships = []
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

    //addShipByPosition(i: number, j: number) {
    //    if (this.currentShip && this.currentShip.isCanPlace) {
    //        this.prevShip = this.currentShip
    //        // TODO проверить нужно ли оно тут
    //        this.fieldCanvas.updateInitialCells()
    //        this.createShipByPosition(i, j)
    //    }
    //}

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
                this.ships.push(new Ship(ship))
                this.fieldCanvas.updateInitialCells()
            }
        }
    }

    
    //private getShift(ship: Ship) {
    //    if (!ship) {
    //        return 0
    //    }
    //    const { size, rotation, position } = ship!
    //    if (!position) {
    //        return 0
    //    }
    //    const i: number = position.i
    //    const j: number = position.j
    //    const shift: number = Math.max(
    //        i * (1 - rotation) + j * rotation + size - 10,
    //        0
    //    )
    //    return shift
    //}

    //private getMinPoint(ship: Ship) {
    //    return -this.getShift(ship)
    //}

    //private centredPosToCommon(ship: Ship) {
    //    if(!ship.position){
    //        throw "Error";
    //        
    //    }
    //    const i = this.getMinPoint(ship) * (1 - ship.rotation) + ship.position.i
    //    const j = this.getMinPoint(ship) * ship.rotation + ship.position.j
    //    return {
    //        i: i,
    //        j: j,
    //    }
    //}

    private checkCollision(ship1: Ship, ship2: Ship): boolean {
        const i1 = ship1.position!.i - 1
        const j1 = ship1.position!.j - 1
        const i2 = ship2.position!.i - 1
        const j2 = ship2.position!.j - 1

        const j = j1 - j2
        const i = i1 - i2

        return (
            ((j >= 0 && Math.abs(j) <= (ship2.size - 1) * ship2.rotation + 1) ||
                (j < 0 &&
                    Math.abs(j) <= (ship1.size - 1) * ship1.rotation + 1)) &&
            ((i >= 0 &&
                Math.abs(i) <= (ship2.size - 1) * (1 - ship2.rotation) + 1) ||
                (i < 0 &&
                    Math.abs(i) <= (ship1.size - 1) * (1 - ship1.rotation) + 1))
        )
    }

    private testFree(ship: Ship): boolean {
        if (!ship || !ship.position) {
            return false
        }

        for (const ship1 of this.ships) {
            if (this.checkCollision(ship1, ship)) {
                return false
            }
        }

        return true
    }
    
    // TODO refactoring required
    private drawShip(ship: Ship) {
        const { size, rotation, position } = ship!
        const i: number = position!.i
        const j: number = position!.j
        for (let k = 0; k < ship.size; k++) {
            const currentPoint: TPosition = {
                i: 0,
                j: 0,
            }
            currentPoint.i = i + k * (1 - rotation)
            currentPoint.j = j + k * rotation
            this.fieldCanvas.setCell(
                currentPoint.i,
                currentPoint.j,
                ECellType.withShip
            )
        }
        return true
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
