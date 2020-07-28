export enum ECellType {
    empty,
    withShip,
    missed,
    hitted
}

export interface IField {
    cells: ECellType[][]
}