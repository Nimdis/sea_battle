import { observable, action } from 'mobx'

export type TGamePhase = 'initialization' | 'game' | 'finished';

export class GameStore {
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

export const game = new GameStore('initialization')