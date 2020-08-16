import React, { FC } from 'react'
import { Redirect } from 'react-router-dom'
import { observable, action } from 'mobx';
import { useObserver } from 'mobx-react-lite';
import axios from 'axios'

import { IGameCreatedMsg } from './services/Lobby'
import { gameStorage } from './GameStorage'

class HomeScreen {
    @observable private token?: string

    @action
    setToken(token: string) {
        this.token = token
    }

    getToken() {
        return this.token;
    }

    handleClick = async () => {
        const resp = await axios.create({
            baseURL: 'http://localhost:4000'
        }).post<IGameCreatedMsg>('/new_game')
        const { playerToken, token } = resp.data
        this.setToken(token)
        gameStorage.setToken(token)
        gameStorage.setPlayerToken(playerToken)
    }
}

const homeScreen = new HomeScreen()


export const Home: FC = () => {
    return useObserver(() => (
        <div>
            {homeScreen.getToken() && <Redirect to={`/game/${homeScreen.getToken()}`} />}
            <button onClick={homeScreen.handleClick}>New game</button>
        </div>
    ))
}