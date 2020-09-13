import { observable, action } from 'mobx'

import { gameStorage } from '../GameStorage'
import { getShips, turn, ITurnResp } from '../api'

import { initScreen } from './initScreen'
import { BattleManager } from "./battleScreen"
import { getECellType } from './CellsStore'

export type TGamePhase = 'initialization' | 'game' | 'finished';

class GameInitializer {
    @observable isLoading: boolean = true
    @observable hasNoToken: boolean = false

    async init(token: string) {
        const playerToken = gameStorage.getPlayerToken()
        const gameToken = gameStorage.getGameToken()

        if (!token) {
            this.setHasNoToken(true)
            this.setLoading(false)
            return
        }

        try {
            const resp = await getShips({
                token,
                playerToken: gameToken === token ? playerToken : undefined
            })
            gameStorage.setPlayerToken(resp.playerToken)
            gameStorage.setGameToken(token)
            initScreen.setCells(resp.cells)
        } catch {
            this.setHasNoToken(true)
        } finally {
            this.setLoading(false)
        }
    }

    @action
    setLoading(loading: boolean) {
        this.isLoading = loading
    }

    @action
    setHasNoToken(hasNoToken: boolean) {
        this.hasNoToken = hasNoToken
    }
}

class EnemyWatcher {
    private interval?: number
    @observable private enemy?: ITurnResp

    start(onEnemyOnline: () => void) {
        const watcher = async () => {
            this.setEnemy(await turn())

            if (this.enemy?.isEnemyOnline) {
                onEnemyOnline()
            }
        }

        watcher()

        setInterval(watcher, 5 * 1000)
    }

    stop() {
        clearInterval(this.interval)
    }

    getEnemy() {
        return this.enemy
    }

    @action
    private setEnemy(enemy: ITurnResp) {
        this.enemy = enemy
    }
}

export class GameStore {
    initializer = new GameInitializer()
    enemyWatcher = new EnemyWatcher()
    battleManager: BattleManager

    @observable private phase: TGamePhase 

    constructor(phase: TGamePhase) {
        this.phase = phase
        this.battleManager = new BattleManager()
    }

    getPhase() {
        return this.phase
    }

    @action
    setPhase(phase: TGamePhase) {
        this.phase = phase
    }

    isMyTurn() {
        return Boolean(this.enemyWatcher.getEnemy()?.isMyTurn)
    }
    
    getWinner() {
        return this.enemyWatcher.getEnemy()?.winner
    }

    @action.bound
    startGame() {
        this.setPhase('game')
    }

    //shot(i: number, j: number) {
    //    try {
    //        return fire(i, j)
    //    } catch {
    //        return
    //    }
    //}

    private handleEnemyOnline = () => {
        if (this.phase === 'initialization') {
            this.setPhase('game')
        }
        const turns = this.enemyWatcher.getEnemy()!.turns.filter(turn => 
            turn.player.token !== gameStorage.getPlayerToken()
        )
        for(const turn of turns){
            initScreen.setCell(turn.position.i, turn.position.j, getECellType(turn.type))
        }
    }

    async init(token: string) {
        await this.initializer.init(token)
        this.enemyWatcher.start(this.handleEnemyOnline)
    }
}
