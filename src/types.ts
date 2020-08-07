import { IField } from './entities/field'

export type TPlayerTurn = 'first' | 'second'

export interface IGameState {
    gamePharse: TGamePhase
    playerTurn: TPlayerTurn
    firstPlayerField: IField
    secondPlayerField: IField
}
