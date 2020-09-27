import React, { FC } from 'react'

import styled from 'styled-components'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { GameScreen } from './screens/GameScreen'
import { HomeScreen } from './screens/HomeScreen'

const Title = styled.div`
    margin: 20px auto 0 auto;
    font-size: 48px;
    width: 440px;
    text-align: center;
`

const App: FC = () => {
    return (
        <>
            <Title>Sea battle</Title>
            <Router>
                <Switch>
                    <Route path="/game/:token">
                        <GameScreen />
                    </Route>
                    <Route path="/">
                        <HomeScreen />
                    </Route>
                </Switch>
            </Router>
        </>
    )
}

export default App
