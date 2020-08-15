import React, { FC } from 'react'
import { Redirect } from 'react-router-dom'
import { observable, action } from 'mobx';
import { useObserver } from 'mobx-react-lite';

import { LobbyService, IGameCreatedMsg } from './services/Lobby'
import { gameStorage } from './GameStorage'
import { IScreenStore, useScreenStoreHooks } from './hooks';

class HomeScreen implements IScreenStore {
    @observable private token?: string

    lobbySerivce: LobbyService

    constructor() {
        this.lobbySerivce = new LobbyService()
    }

    @action
    setToken(token: string) {
        this.token = token
    }

    getToken() {
        return this.token;
    }

    private onCreated(msg: IGameCreatedMsg) {
        this.setToken(msg.token)
        gameStorage.setToken(msg.token)
        gameStorage.setPlayerToken(msg.playerToken)
    }

    onUnmount() {
        this.lobbySerivce.destroy()
    }

    handleClick = async () => {
        this.onCreated(await this.lobbySerivce.newGame())
    }
}

const homeScreen = new HomeScreen()


export const Home: FC = () => {
    useScreenStoreHooks(homeScreen)

    return useObserver(() => (
        <div>
            {homeScreen.getToken() && <Redirect to={`/game/${homeScreen.getToken()}`} />}
            <button onClick={homeScreen.handleClick}>New game</button>
        </div>
    ))
}