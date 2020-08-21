import React, { FC, useMemo } from 'react'
import { Redirect } from 'react-router-dom'
import { observable, action } from 'mobx';
import { useObserver } from 'mobx-react-lite';

import { gameStorage } from '../GameStorage'
import { newGame } from '../api'

class HomeScreenStore {
    @observable private token?: string

    @action
    setToken(token: string) {
        this.token = token
    }

    getToken() {
        return this.token;
    }

    handleClick = async () => {
        const { playerToken, token } = await newGame()
        this.setToken(token)
        gameStorage.setToken(token)
        gameStorage.setPlayerToken(playerToken)
    }
}

export const HomeScreen: FC = () => {
    const homeScreen = useMemo(() => new HomeScreenStore(), [])

    return useObserver(() => (
        <div>
            {homeScreen.getToken() && <Redirect to={`/game/${homeScreen.getToken()}`} />}
            <button onClick={homeScreen.handleClick}>New game</button>
        </div>
    ))
}