import { CellsStore, ECellType, TCells } from './CellsStore'
import { cloneDeep, range } from "lodash"

import { FieldCanvas } from './field'

export type TPosition = {
    i: number
    j: number
}

type TRotationUnit = 0 | 1

export type TRotation = {
    i: TRotationUnit
    j: TRotationUnit
}

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

export class ShipManager {
    private fieldCanvas: FieldCanvas
    private currentShip?: Ship
    private prevShip?: Ship

    constructor() {
        this.fieldCanvas = new FieldCanvas(range(0, 10).map(() =>
        range(0, 10).map(() => ECellType.empty)))
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
    //leaveCurrentShip() {
    //    if(this.currentShip){
    //        this.currentShip.position = undefined
    //    }
    //    this.fieldCanvas.cleanUpCells()
    //}

    updateCurrentShipPostion(i: number, j: number) {
        if (this.currentShip) {
            this.currentShip.position = { i, j }
            this.drawShip(this.currentShip)

        }
    }

    addShipByPostion(i: number, j: number) {
        this.upsertShipByPosition(i, j)
        if(this.currentShip && this.currentShip.isCanPlace){
            this.prevShip = this.currentShip
            // TODO проверить нужно ли оно тут
            this.fieldCanvas.updateInitialCells()
            this.createShipByPosition(i, j)
            return true
        }
        return false
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
        this.fieldCanvas.cleanUpCells()
        if (!ship) {
            return
        }
        const { size, rotation, position } = ship!
        if (!position) {
            return
        }
        ship.isCanPlace = true
        const i: number = position.i;
        const j: number = position.j;
        const shift: number = Math.max((i * rotation.i + j * rotation.j) + size - 10, 0)
        const minPoint: number = 0 - shift
        const maxPoint: number = size - shift
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

    getCurrentShip(){

        if(this.currentShip){
            const ship: IShip = {
                position: this.currentShip.position,
                rotation: this.currentShip.rotation,
                size: this.currentShip.size,
                num: this.currentShip.num
            }
            return ship
        }
    }

    //randomPlaceShips(){
    //    while(true){
    //        if(Math.random()<0.5){
    //            this.rotateCurrentShip()
    //        }
    //        this.addShipByPostion(Math.floor(Math.random()*10), Math.floor(Math.random()*10))
    //        if(this.currentShip.size < 1){
    //            break
    //        }
    //    }
    //}
}



