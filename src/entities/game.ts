import { observable, action } from 'mobx'

export type TGamePhase = 'initialization' | 'game' | 'finished';

export class Game {
    @observable private phase: TGamePhase 

    constructor(phase: TGamePhase) {
        this.phase = phase
    }

    getPhase() {
        return this.phase
    }

    @action
    setPhase(phase: TGamePhase) {
        this.phase = phase
    }
}

export const game = new Game('initialization')