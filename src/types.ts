import { FieldStore } from './entities/field'

export type TPlayerTurn = 'first' | 'second'

export interface IGameState {
    //gamePharse: TGamePhase
    playerTurn: TPlayerTurn
    firstPlayerField: FieldStore
    secondPlayerField: FieldStore
}
