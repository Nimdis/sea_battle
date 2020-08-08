import { observable, action } from 'mobx'
import { EField, ECellType } from './field'

export type TPosition = {
    i: number
    j: number
}

export enum EShip {
    one,
    two,
    three,
    four
}

export interface ICurrentShip {
    position?: TPosition
    type: EShip
    rotation: TPosition
    num: number
}


export class EInitScreen {
    @observable tempField: EField
    currentShip: ICurrentShip = {
        position: undefined,
        type: EShip.four,
        rotation: {
            i: 1,
            j: 0
          },
        num: 0
    }

    constructor(field: EField) {
        this.tempField = field.clone()
    }

    private testFree(filed : EField, point : TPosition) : boolean{
        for(let i = point.i==0?0:-1; i < 2-Math.floor(point.i/9); i++){
            for(let j = point.i==0?0:-1; j < 2-Math.floor(point.i/9); j++){
                if(filed.getCell(point.i + i, point.j + j) == ECellType.withShip){
                    return true
                }
            }
        }
        return false
    }

    addCurrentShip() : void{
        if(this.currentShip.position != undefined){ 
            const axis : TPosition = {i: this.currentShip.rotation.i,
                                      j: this.currentShip.rotation.j}
            const i : number = this.currentShip.position.i
            const j : number = this.currentShip.position.j
            const minPoint : number = 0
            const maxPoint : number = this.currentShip.type
            for(let k = minPoint; k <= maxPoint; k++){
                const currentPoint : TPosition = {
                    i: 0,
                    j: 0
                }
                if(k + axis.i*i > 9 || k + axis.j*j > 9){
                    currentPoint.i = axis.j * i + axis.i * (9 - k + minPoint)
                    currentPoint.j = (9 - k + minPoint) * axis.j + j * axis.i
                    this.tempField.setCell(currentPoint.i, currentPoint.j, ECellType.withShip)
                }else if(k + axis.i < 0 || k + axis.j < 0){
                    currentPoint.i = i * axis.j + axis.i * (Math.abs(k) + maxPoint)
                    currentPoint.j = (Math.abs(k) + maxPoint) * axis.j + axis.i * j
                    this.tempField.setCell(currentPoint.i, currentPoint.j, ECellType.withShip)
                }else{
                    currentPoint.i = i + k * axis.i
                    currentPoint.j = j + k * axis.j
                    this.tempField.setCell(currentPoint.i, currentPoint.j, ECellType.withShip)
                }
            }
        }
    }

    inverseRotation() : void{
        this.currentShip.rotation.i = 1 - this.currentShip.rotation.i
        this.currentShip.rotation.j = 1 - this.currentShip.rotation.j
    }

    setCurrentShipPosition(i: number, j: number){
        this.currentShip.position = {
            i: i,
            j: j
        }
    }
}