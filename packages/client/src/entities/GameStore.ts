import { observable, action } from 'mobx'

import { gameStorage } from '../GameStorage'
import { getShips, turn, ITurnResp, GameClient } from '../api'

import { CellsStore, getECellType, ECellTurnType } from './CellsStore'
import { EnemyShipManager } from './EnemyShipManager'
import { ShipManager } from './ShipManager'

// https://socket.io/docs/rooms/#Joining-and-leaving
// Передавать 2 токена когда сокет коннектится (токен игры и юзера)
// На сервере взять эти токены и сделать комнату по uid игры
// Вызвать эвент fire, после которого будет приходить апдейт на всех игроков в комнате c результатом действия,
// НО если это действие игрока который его совершил, то у него на поле врага изменение, в противном случае на своём

export type TGamePhase = 'initialization' | 'game' | 'finished'

export class GameStoreInitializer {
    @observable isLoading: boolean = true
    @observable hasError: boolean = false

    async init(
        token: string,
        phase: TGamePhase
    ): Promise<GameStore | undefined> {
        const playerToken = gameStorage.getPlayerToken()
        const gameToken = gameStorage.getGameToken()

        try {
            const resp = await getShips({
                token,
                playerToken: gameToken === token ? playerToken : undefined,
            })

            gameStorage.setPlayerToken(resp.playerToken)
            gameStorage.setGameToken(token)

            const enemyShipManager = await EnemyShipManager.initialize(
                playerToken ?? resp.playerToken
            )
            const shipManager = new ShipManager(
                CellsStore.makeInitial().getCells()
            )

            shipManager.setCells(resp.cells)

            const gameStore = new GameStore(
                phase,
                enemyShipManager,
                shipManager
            )

            const gc = new GameClient(
                playerToken ?? resp.playerToken,
                gameToken!
            )
            gc.onOnline((a: any) => {
                gameStore.setIsEnemyOnline(true)
                if (gameStore.getPhase() === 'initialization') {
                    gameStore.setPhase('game')
                }
            })

            gc.onEnemyPlayerOffline(() => {
                gameStore.setIsEnemyOnline(false)
            })

            return gameStore
        } catch (err) {
            console.error(err)
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

export class GameStore {
    private enemyShipManager: EnemyShipManager
    private shipManager: ShipManager
    isMyTurn: boolean

    @observable private isEnemyOnline: boolean = false
    @observable private phase: TGamePhase

    constructor(
        phase: TGamePhase,
        enemyShipManager: EnemyShipManager,
        shipManager: ShipManager
    ) {
        this.phase = phase
        this.enemyShipManager = enemyShipManager
        this.shipManager = shipManager
        this.isMyTurn = false
    }

    getEnemyShipManager() {
        return this.enemyShipManager
    }

    getPhase() {
        return this.phase
    }

    getIsEnemyOnline() {
        return this.isEnemyOnline
    }

    @action
    setIsEnemyOnline(val: boolean) {
        this.isEnemyOnline = val
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

    getWinner() {
        return 'hello'
    }

    @action.bound
    startGame() {
        this.setPhase('game')
    }

    private handleFire = (i: number, j: number, result: ECellTurnType) => {
        if (this.isMyTurn) {
            this.enemyShipManager.setCell(i, j, getECellType(result))
            return
        }
        this.shipManager.setCell(i, j, getECellType(result))
    }

    private handleEnemyOnline = async () => {
        if (this.phase === 'initialization') {
            this.setPhase('game')
        }
        const turns = (await turn()).turns.filter(
            (turn) => turn.player.token !== gameStorage.getPlayerToken()
        )
        for (const turn of turns) {
            this.enemyShipManager.setCell(
                turn.position.i,
                turn.position.j,
                getECellType(turn.type)
            )
        }
    }
}
