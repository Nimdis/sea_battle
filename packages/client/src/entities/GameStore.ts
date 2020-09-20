import { observable, action } from 'mobx'
import io, { Socket } from 'socket.io-client';

import { gameStorage } from '../GameStorage'
import { getShips, turn, ITurnResp } from '../api'

import { CellsStore, getECellType } from './CellsStore'
import { EnemyShipManager } from './EnemyShipManager'
import { ShipManager } from './ShipManager'

// https://socket.io/docs/rooms/#Joining-and-leaving
// Передавать 2 токена когда сокет коннектится (токен игры и юзера)
// На сервере взять эти токены и сделать комнату по uid игры
// Вызвать эвент fire, после которого будет приходить апдейт на всех игроков в комнате c результатом действия, 
// НО если это действие игрока который его совершил, то у него на поле врага изменение, в противном случае на своём

class GameClient {
    private client: typeof Socket

    constructor() {
        this.client = io('http://localhost:4000')
    }

    fire() {

    }
}

export type TGamePhase = 'initialization' | 'game' | 'finished';

export class GameStoreInitializer {
    @observable isLoading: boolean = true
    @observable hasError: boolean = true

    async init(token: string, phase: TGamePhase): Promise<GameStore | undefined> {
        const playerToken = gameStorage.getPlayerToken()
        const gameToken = gameStorage.getGameToken()

        try {
            const enemyShipManager = await EnemyShipManager.initialize(gameStorage.getPlayerToken())
            const resp = await getShips({
                token,
                playerToken: gameToken === token ? playerToken : undefined
            })
            gameStorage.setPlayerToken(resp.playerToken)
            gameStorage.setGameToken(token)
            enemyShipManager.setCells(resp.cells)
            return new GameStore(
                phase,
                enemyShipManager,
                new ShipManager(CellsStore.makeInitial().getCells())
            )
        } catch (err) {
            console.log(err)
            this.setHasError(true)
        } finally {
            this.setLoading(false)
        }
    }

    @action
    setLoading(loading: boolean) {
        this.isLoading = loading
    }

    @action
    setHasError(hasError: boolean) {
        this.hasError = hasError
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
    private enemyWatcher = new EnemyWatcher()
    private enemyShipManager: EnemyShipManager
    private shipManager: ShipManager

    @observable private phase: TGamePhase 

    constructor(phase: TGamePhase, enemyShipManager: EnemyShipManager, shipManager: ShipManager) {
        this.phase = phase
        this.enemyShipManager = enemyShipManager
        this.shipManager = shipManager
        this.enemyWatcher.start(this.handleEnemyOnline)
    }

    getPhase() {
        return this.phase
    }

    getEnemyCells() {
        return this.enemyShipManager.getCells()
    }

    getCells() {
        return this.shipManager.getCells()
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

    private handleEnemyOnline = () => {
        if (this.phase === 'initialization') {
            this.setPhase('game')
        }
        const turns = this.enemyWatcher.getEnemy()!.turns.filter(turn => 
            turn.player.token !== gameStorage.getPlayerToken()
        )
        for(const turn of turns){
            this.enemyShipManager.setCell(turn.position.i, turn.position.j, getECellType(turn.type))
        }
    }

}
