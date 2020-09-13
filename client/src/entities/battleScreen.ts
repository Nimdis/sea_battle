import { TCells, getECellType, CellsStore, ECellType } from './CellsStore'
import { FieldCanvas } from './field'
import { TPosition } from './initScreen'
import { fire, turn as getTurns } from '../api/index'
import { gameStorage } from "../GameStorage"
import { cloneDeep } from "lodash"

export class BattleManager {
    private fieldCanvas: FieldCanvas
    private cursor?: TPosition 

    constructor() {
        const init = async () => {
            const turns = (await getTurns()).turns.filter(turn => 
                turn.player.token === gameStorage.getPlayerToken()
            )
            for(const turn of turns){
                this.fieldCanvas.setCell(turn.position.i, turn.position.j, getECellType(turn.type))
            }
        }
        this.fieldCanvas = new FieldCanvas(CellsStore.makeInitialCells().getCells())
        init()
    }

    getCells() {
        return this.fieldCanvas.getCells()
    }

    setCells(cells: TCells) {
        this.fieldCanvas.setCells(cells);
    }

    async shot(i: number, j: number) {
        try {
            const type = getECellType((await fire(i, j)).type)
            this.fieldCanvas.setCell(i, j, type)
        } catch (error) {
            console.log(error)
        }
    }

    updateCursorPosition(i: number, j: number) {
        this.fieldCanvas.cleanUpCells()
        this.cursor = {i: i, j: j} 
    }

}

export class BattleScreenStore {
    private battleManager: BattleManager
    private localField: CellsStore

    constructor(battleManager: BattleManager) {
        this.battleManager = battleManager
        this.localField = new CellsStore(cloneDeep(battleManager.getCells()))
    }

    handleMouseOver = (i: number, j: number) => {
        this.localField.setCell(i, j, ECellType.withShip)
    }

    handleMouseLeave = () => {
        this.localField.setCells(cloneDeep(this.battleManager.getCells()))
    }

    handleClick = (i: number, j: number) => {
        this.battleManager.shot(i, j)
    }

    getCells(){
        return this.localField.getCells()
    }
}