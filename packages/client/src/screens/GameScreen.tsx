import React, { FC, useMemo, useEffect, useRef } from 'react'
import { observable, action } from 'mobx'
import { useObserver } from 'mobx-react-lite'
import { Redirect, useParams } from 'react-router'

import { GameContext, useGameStore } from '../GameContext'

import { InitScreen } from './InitScreen'
import { BattleScreen } from './BattleScreen'
import {
    GameStoreInitializer,
    GameStore,
    TGamePhase,
} from '../entities/GameStore'
import { Container } from '../components/Container'
import { Loading } from '../components/Loading'

class GameScreenStore {
    gameStoreIntializer: GameStoreInitializer
    // FIXME remove observable
    @observable gameStore?: GameStore

    constructor() {
        this.gameStoreIntializer = new GameStoreInitializer()
    }

    @observable hasNoToken: boolean = false

    get isLoading() {
        return this.gameStoreIntializer.isLoading
    }

    get hasError() {
        return this.gameStoreIntializer.hasError
    }

    @action
    async initGame(token?: string) {
        if (!token) {
            this.hasNoToken = true
            return
        }
        this.gameStore = await this.gameStoreIntializer.init(
            token,
            'initialization'
        )
    }
}

const Error: FC = () => {
    return <div>Error</div>
}

const gameScreens = (gameStore?: GameStore) => {
    if (!gameStore) {
        return null
    }

    console.log(gameStore.getPhase())

    switch (gameStore.getPhase()) {
        case 'initialization':
            return <InitScreen />
        case 'game':
            return <BattleScreen />
        case 'finished':
        default:
            return <Error />
    }
}

export const GameScreen: FC = () => {
    const gameScreenStore = useMemo(() => new GameScreenStore(), [])
    const { token } = useParams<{ token: string }>()

    useEffect(() => {
        gameScreenStore.initGame(token)
    }, [])

    return useObserver(() => {
        if (gameScreenStore.isLoading) {
            return <Loading />
        }

        if (gameScreenStore.hasNoToken) {
            return <Redirect to="/" />
        }

        if (gameScreenStore.hasError) {
            return <Error />
        }

        const { gameStore } = gameScreenStore

        return (
            <Container>
                <GameContext.Provider value={gameStore!}>
                    {gameScreens(gameStore)}
                </GameContext.Provider>
            </Container>
        )
    })
}
