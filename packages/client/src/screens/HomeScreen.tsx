import React, { FC, useMemo } from 'react'
import { Redirect } from 'react-router-dom'
import { observable, action } from 'mobx';
import { useObserver } from 'mobx-react-lite';

import { gameStorage } from '../GameStorage'
import { newGame } from '../api'
import { Button } from '../components/Button'
import { Container } from '../components/Container'

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
        gameStorage.clear()
        const { playerToken, token } = await newGame()
        this.setToken(token)
        gameStorage.setPlayerToken(playerToken)
        gameStorage.setGameToken(token)
    }
}

export const HomeScreen: FC = () => {
    const homeScreen = useMemo(() => new HomeScreenStore(), [])

    return useObserver(() => (
        <Container centred>
            {homeScreen.getToken() && <Redirect push to={`/game/${homeScreen.getToken()}`} />}
            <div>
                <Button onClick={homeScreen.handleClick}>New game</Button>
            </div>
        </Container>
    ))
}