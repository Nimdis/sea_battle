export type TGamePhase = 'initialization' | 'game' | 'finished';
export type TPlayerTurn = 'first' | 'second'

export enum ECellType {
    empty,
    withShip,
    missed,
    hitted
}

export interface IField {
    cells: ECellType[][]
}

export interface IGameState {
    gamePharse: TGamePhase
    playerTurn: TPlayerTurn
    firstPlayerField: IField
    secondPlayerField: IField
}
