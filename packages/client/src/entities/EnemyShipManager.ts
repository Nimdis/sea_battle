import { FieldCanvas } from './FieldStore'
import { GameClient, turn as getTurns } from '../api/index'
import { CellsStore, getECellType } from './CellsStore'
import { ECellType, TCells } from './CellsStore'

export class EnemyShipManager {
    private fieldCanvas: FieldCanvas
    gameClient?: GameClient

    constructor() {
        this.fieldCanvas = new FieldCanvas(CellsStore.makeInitial().getCells())
        //this.gameClient = gameClient
    }

    static async initialize(playerToken: string) {
        const enemyShipManager = new EnemyShipManager()
        const turns = (await getTurns()).turns.filter(
            (turn) => turn.player.token === playerToken
        )
        for (const turn of turns) {
            enemyShipManager.fieldCanvas.setCell(
                turn.position.i,
                turn.position.j,
                getECellType(turn.type)
            )
        }
        return enemyShipManager
    }

    getCells() {
        return this.fieldCanvas.getCells()
    }

    setCells(cells: TCells) {
        this.fieldCanvas.setCells(cells)
    }

    setCell(i: number, j: number, value: ECellType) {
        this.fieldCanvas.setCell(i, j, value)
    }

    shot(i: number, j: number) {
        this.gameClient!.fire(i, j)
    // try {
    //     const type = getECellType((await fire(i, j)).type)
    //     this.fieldCanvas.setCell(i, j, type)
    // } catch (error) {
    //     console.log(error)
    // }
    }
}
