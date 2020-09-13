import { CellsStore, ECellType, TCells } from './CellsStore'
import { cloneDeep, range, join } from "lodash"

import { FieldCanvas } from './field'

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
        this.rotation = (1 - this.rotation) as TRotation
    }
}

export class ShipManager {
    private fieldCanvas: FieldCanvas
    private currentShip?: Ship
    private prevShip?: Ship
    private ships: Ship[]

    constructor() {
        this.fieldCanvas = new FieldCanvas(range(0, 10).map(() =>
        range(0, 10).map(() => ECellType.empty)))
        this.ships = []
    }

    getCells() {
        return this.fieldCanvas.getCells()
    }

    updateCurrentShipPosition(i: number, j: number) {
        if (this.currentShip) {
            this.currentShip.position = { i, j }
            this.drawShip(this.currentShip)
        }
    }

    createShipByPosition(i: number, j: number) {
        const shipDescr: IShip = {
            num: 1,
            position: {
                i, j
            },
            rotation: 0,
            size: this.prevShip ? this.prevShip.size : 4
        };
        if (this.prevShip) {
            if (MAX_COUNT_BY_SHIP_TYPE[this.prevShip.size] === this.prevShip.num) {
                shipDescr.size -= 1
                shipDescr.num = 1

            } else {
                shipDescr.num = this.prevShip.num + 1
            }
        }
        this.currentShip = new Ship(shipDescr)
        // TODO проверить, скорее всего оно нужно
        this.drawShip(this.currentShip)
    }

    addShipByPostion(i: number, j: number) {
        this.updateCurrentShipPosition(i, j)
        if (this.currentShip?.isCanPlace) {
            this.prevShip = this.currentShip
            // TODO проверить нужно ли оно тут
            this.fieldCanvas.updateInitialCells()
            this.ships.push(this.currentShip)
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

    private getShift(ship: Ship){
        if (!ship) {
            return 0
        }
        const { size, rotation, position } = ship!
        if (!position) {
            return 0
        }
        const i: number = position.i
        const j: number = position.j
        const shift: number = Math.max((i*(1 - rotation)+j*rotation)+size-10, 0)
        return shift;
    }
    
    private checkCollision(ship1: Ship, ship2: Ship) : boolean{
        if(!ship1.position || !ship2.position){
            return false
        }
        const i1 = (-this.getShift(ship1)) * (1 - ship1.rotation) + ship1.position.i - 1
        const j1 = (-this.getShift(ship1)) * ship1.rotation + ship1.position.j - 1
        const i2 = (-this.getShift(ship2)) * (1 - ship2.rotation) + ship2.position.i - 1
        const j2 = (-this.getShift(ship2)) * ship2.rotation + ship2.position.j - 1
        const j = j1 - j2;
        const i = i1 - i2;
        return ((j >= 0 && Math.abs(j) <= (ship2.size - 1) * ship2.rotation + 1) || 
                (j < 0 && Math.abs(j) <= (ship1.size - 1) * ship1.rotation + 1)) &&
               ((i >= 0 && Math.abs(i) <= (ship2.size - 1) * (1 - ship2.rotation) + 1) || 
                (i < 0 && Math.abs(i) <= (ship1.size - 1) * (1 - ship1.rotation) + 1))
    }

    private testFree(field: TCells, i: number, j: number): boolean {
        //for (const ship1 of this.ships) {
        //    if(this.checkCollision(ship1, ship2)){
        //        return false
        //    }
        //}
        for (let x = i == 0 ? 0 : -1; x < 2 - Math.floor(i / 9); x++) {
            for (let y = j == 0 ? 0 : -1; y < 2 - Math.floor(j / 9); y++) {
                if (field[i + x][j + y] == ECellType.withShip) {
                    this.fieldCanvas.setCell(i, j, ECellType.killed)
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
        const minPoint: number = -this.getShift(ship)
        const maxPoint: number = size - this.getShift(ship)
        for (let k = minPoint; k < maxPoint; k++) {
            const currentPoint: TPosition = {
                i: 0,
                j: 0
            }
            currentPoint.i = i + k * (1 - rotation)
            currentPoint.j = j + k * rotation
            if(this.testFree(this.fieldCanvas.initialCells, currentPoint.i, currentPoint.j)){
                this.fieldCanvas.setCell(currentPoint.i, currentPoint.j, ECellType.withShip)
            }else{
                this.fieldCanvas.setCell(currentPoint.i, currentPoint.j, ECellType.hitted)
                ship.isCanPlace = false
            }
        }
        return ship.isCanPlace
    }
    
    //placeShip(ship: Ship){
    //    this.fieldCanvas.cleanUpCells()
    //    this.drawShip(ship)
    //    if(ship.isCanPlace){
    //        this.fieldCanvas.updateInitialCells()
    //        return true
    //    }
    //    return false
    //}

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

    randomPlaceShips(){
        const ships: IShip[] = []
        this.createShipByPosition(0,0)
        while (true) {
            if (Math.random() < 0.5) {
                this.rotateCurrentShip()
            }
           
            if (this.addShipByPostion(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10))) {
                const ship = this.getCurrentShip()
                if (!ship) {
                    break
                }
                ships.push(ship)
                //this.ships.push(new Ship(ship))
                if (ship.num == 4) {
                    break
                }
            }
        }
        return ships
    }
}


