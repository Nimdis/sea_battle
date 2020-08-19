import React, { FC, useState, useEffect, useRef } from 'react'
import { useObserver } from 'mobx-react-lite'
import { observable, action } from 'mobx';
import axios from 'axios'
import { Redirect } from 'react-router';

import { InitScreen } from './screens/InitScreen'
import { IShip } from './entities/initScreen'
import { game } from './entities/game'
import { initScreen } from './entities/initScreen'
import { gameStorage } from './GameStorage'
import { IScreenStore, useScreenStoreHooks } from './hooks';
import { TCells } from './entities/CellsStore';
import { GameScreen } from './screens/GameScreen'

class GameInitializer {
    @observable isLoading: boolean = true
    @observable hasNoToken: boolean = false

    async init() {
        const playerToken = gameStorage.getPlayerToken()
        const token = gameStorage.getToken()
        if (!playerToken || !token) {
            this.setHasNoToken(true)
            this.setLoading(false)
            return
        }
        try {
            const resp = await axios.create({
                baseURL: 'http://localhost:4000',
                headers: {
                    'x-auth-player': playerToken
                }
            // TODO write type of server respose
            }).get<{
                cells: TCells
                ships: IShip[]
            }>('/ships')
            initScreen.setCells(resp.data.cells)
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

class GameScreenStore implements IScreenStore {
    gameInitializer = new GameInitializer()

    @action.bound
    startGame() {
        game.setPhase('game')
    }

    onMount() {
        this.gameInitializer.init()
    }
}

const gameScreen = new GameScreenStore()

export const Game: FC = () => {
    useScreenStoreHooks(gameScreen)

    return useObserver(() => {
        if (gameScreen.gameInitializer.isLoading) {
            return <div>Loading...</div>
        }

        if (gameScreen.gameInitializer.hasNoToken) {
            return <Redirect to="/" />
        }

        switch (game.getPhase()) {
            case 'initialization':
                return <InitScreen onStartGame={gameScreen.startGame} />
            case 'game':
                return <GameScreen />
            case 'finished':
            default:
                return <div>Error</div>
        }
    })
};
