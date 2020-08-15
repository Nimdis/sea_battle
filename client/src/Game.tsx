import React, { FC, useState, useEffect, useRef } from 'react'
import { useObserver } from 'mobx-react-lite'
import { observable, action } from 'mobx';

import { InitScreen } from './screens/InitScreen'
import { game } from './entities/game'
import { GameService } from './services/Game'
import { gameStorage } from './GameStorage'
import { IScreenStore, useScreenStoreHooks } from './hooks';
import { Redirect } from 'react-router';

class GameScreen implements IScreenStore {
    @observable isLoading: boolean = true
    @observable hasNoToken: boolean = false

    private gameService?: GameService

    async onMount() {
        const playerToken = gameStorage.getPlayerToken()
        const token = gameStorage.getToken()
        if (!playerToken || !token) {
            this.setHasNoToken(true)
            this.setLoading(false)
            return
        }
        this.gameService = new GameService(token, playerToken);
        try {
            console.log('====')
            const ships = await this.gameService.getShips()
            console.log('====')
            console.log(ships)
        } catch {
            this.setHasNoToken(true)
        } finally {
            this.setLoading(false)
        }
    }

    onUnmount() {
        if (this.gameService) {
            this.gameService?.destroy()
        }
    }

    @action
    setLoading(loading: boolean) {
        this.isLoading  = loading
    }

    @action
    setHasNoToken(hasNoToken: boolean) {
        this.hasNoToken  = hasNoToken
    }
}

const gameScreen = new GameScreen()

export const Game: FC = () => {
    useScreenStoreHooks(gameScreen)

    return useObserver(() => {
        if (gameScreen.isLoading) {
            return <div>Loading...</div>
        }

        if (gameScreen.hasNoToken) {
            return <Redirect to="/" />
        }

        switch (game.getPhase()) {
            case 'initialization':
                return <InitScreen />
            case 'game':
            case 'finished':
            default:
                return <div>Error</div>
        }
    })
};
