import { CellsStore, ECellType, TCells } from './CellsStore'
import { cloneDeep, range, join } from 'lodash'

import { FieldCanvas } from './field'
import { DH_CHECK_P_NOT_PRIME } from 'constants'

export type TPosition = {
    i: number
    j: number
}

export type TRotation = 0 | 1

export type TShipSize = 1 | 2 | 3 | 4

interface ICurrentShip {
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

    constructor({ size, position, rotation, num }: IShip) {
        this.size = size
        this.position = position
        this.rotation = rotation
        this.num = num
    }

    rotate() {
        this.rotation = (1 - this.rotation) as TRotation
    }
}

const ShipToIShip = (ship: Ship) => {
    return {
        size: ship.size,
        position: ship.position,
        rotation: ship.rotation,
        num: ship.num,
    } as IShip
}

export class ShipManager {
    private fieldCanvas: FieldCanvas
    private currentShip: Ship
    private ships: Ship[]

    constructor() {
        this.fieldCanvas = new FieldCanvas(
            range(0, 10).map(() => range(0, 10).map(() => ECellType.empty))
        )
        this.ships = []
        this.currentShip = new Ship({
            num: 1,
            position: undefined,
            rotation: 0,
            size: 4,
        } as IShip)
    }

    getCells() {
        return this.fieldCanvas.getCells()
    }

    setCurrentShipPosition(i: number, j: number) {
        this.currentShip.position = { i, j }
    }

    createNewCurrentShip() {
        this.ships.push(cloneDeep(this.currentShip))
        this.currentShip.rotation = 0
        this.currentShip.position = undefined
        if (
            MAX_COUNT_BY_SHIP_TYPE[this.currentShip.size] ===
            this.currentShip.num
        ) {
            this.currentShip.size -= 1
            this.currentShip.num = 1
        } else {
            this.currentShip.num += 1
        }
    }

    rotateCurrentShip() {
        this.currentShip.rotate()
    }

    private getShift(ship: Ship) {
        if (!ship) {
            return 0
        }
        const { size, rotation, position } = ship!
        if (!position) {
            return 0
        }
        const i: number = position.i
        const j: number = position.j
        const shift: number = Math.max(
            i * (1 - rotation) + j * rotation + size - 10,
            0
        )
        return shift
    }

    private getMinPoint(ship: Ship) {
        return -this.getShift(ship)
    }

    private getMaxPoint(ship: Ship) {
        return ship.size - this.getShift(ship)
    }

    private checkCollision(ship1: Ship, ship2: Ship): boolean {
        const i1 =
            this.getMinPoint(ship1) * (1 - ship1.rotation) +
            ship1.position!.i -
            1
        const j1 =
            this.getMinPoint(ship1) * ship1.rotation + ship1.position!.j - 1
        const i2 =
            this.getMinPoint(ship2) * (1 - ship2.rotation) +
            ship2.position!.i -
            1
        const j2 =
            this.getMinPoint(ship2) * ship2.rotation + ship2.position!.j - 1
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
        for (let k = this.getMinPoint(ship); k < this.getMaxPoint(ship); k++) {
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

    placeShip(ship: Ship) {
        if (this.testFree(ship)) {
            this.fieldCanvas.cleanUpCells()
            this.drawShip(ship)
            this.fieldCanvas.updateInitialCells()
            this.createNewCurrentShip()
            return true
        }
        return false
    }

    getCurrentShip() {
        if (this.currentShip) {
            const ship: IShip = {
                position: this.currentShip.position,
                rotation: this.currentShip.rotation,
                size: this.currentShip.size,
                num: this.currentShip.num,
            }
            return ship
        }
    }

    randomPlaceShips() {
        const ships: IShip[] = []
        while (true) {
            if (Math.random() < 0.5) {
                this.rotateCurrentShip()
            }
            this.setCurrentShipPosition(
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10)
            )
            if (this.placeShip(this.currentShip)) {
                ships.push(ShipToIShip(this.ships[this.ships.length - 1]))
                console.log(ShipToIShip(this.ships[this.ships.length - 1]))
                if (this.ships[this.ships.length - 1].num == 4) {
                    break
                }
            }
        }
        return ships
    }
}
