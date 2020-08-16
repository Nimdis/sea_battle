import React, { FC, useState, useEffect, useRef } from 'react'
import { useObserver } from 'mobx-react-lite'
import { observable, action } from 'mobx';
import axios from 'axios'
import { Redirect } from 'react-router';

import { InitScreen } from './screens/InitScreen'
import { game } from './entities/game'
import { initScreen } from './entities/initScreen'
import { gameStorage } from './GameStorage'
import { IScreenStore, useScreenStoreHooks } from './hooks';

class GameScreen implements IScreenStore {
    @observable isLoading: boolean = true
    @observable hasNoToken: boolean = false

    async onMount() {
        const playerToken = gameStorage.getPlayerToken()
        const token = gameStorage.getToken()
        if (!playerToken || !token) {
            this.setHasNoToken(true)
            this.setLoading(false)
            return
        }
        try {
            console.log('====')
            const resp = await axios.create({
                baseURL: 'http://localhost:4000',
                headers: {
                    'x-auth-player': playerToken
                }
            // TODO write type of server respose
            }).get<{}>('/ships')
            console.log(resp.data)
            console.log('====')
            // TODO move ships to initScreen entity
            // initScreen
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
