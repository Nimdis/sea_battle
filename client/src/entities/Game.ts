import { observable, action } from 'mobx'

import { gameStorage } from '../GameStorage'
import { getShips } from '../api'

import { initScreen } from './initScreen'

export type TGamePhase = 'initialization' | 'game' | 'finished';

class GameInitializer {
    @observable isLoading: boolean = true
    @observable hasNoToken: boolean = false

    async init() {
        const playerToken = gameStorage.getPlayerToken()
        const token = gameStorage.getToken()

        if (!token) {
            this.setHasNoToken(true)
            this.setLoading(false)
            return
        }

        try {
            const resp = await getShips({
                token,
                playerToken
            })
            initScreen.setCells(resp.cells)
        } catch {
            this.setHasNoToken(true)
        } finally {
            this.setLoading(false)
        }
    }

    @action
    setLoading(loading: boolean) {
        this.isLoading  = loading
    }

    @action
    setHasNoToken(hasNoToken: boolean) {
        this.hasNoToken = hasNoToken
    }
}

export class GameStore {
    initializer = new GameInitializer()

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
    
    @action.bound
    startGame() {
        this.setPhase('game')
    }

    init() {
        this.initializer.init()
    }
}
