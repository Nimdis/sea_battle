import React, { FC, useMemo, useEffect, useRef } from 'react'
import { useObserver } from 'mobx-react-lite'
import { Redirect, useParams } from 'react-router';

import { GameContext, useGameStore } from '../GameContext'

import { InitScreen } from './InitScreen'
import { BattleScreen } from './BattleScreen'
import { GameStore, TGamePhase } from '../entities/Game';
import { Container } from '../components/Container'
import { Loading } from '../components/Loading'

interface IGamePresenterProps {
    isLoading: boolean;
    hasNoToken: boolean;
    phase: TGamePhase
}

const GamePresenter: FC<IGamePresenterProps> = ({ hasNoToken, phase, isLoading }) => {
    if (isLoading) {
        return <Loading />
    }

    if (hasNoToken) {
        return <Redirect to="/" />
    }

    switch (phase) {
        case 'initialization':
            return <InitScreen />
        case 'game':
            return <BattleScreen />
        case 'finished':
        default:
            return <div>Error</div>
    }
}

const GameInner = () => {
    const gameStore = useGameStore()

    return useObserver(() => {
        return (
            <GamePresenter 
                hasNoToken={gameStore.initializer.hasNoToken}
                isLoading={gameStore.initializer.isLoading}
                phase={gameStore.getPhase()}
                />
        )
    })
};

export const GameScreen: FC = () => {
    const gameStore = useMemo(() => new GameStore('initialization'), [])
    const { token } = useParams<{ token: string }>()

    useEffect(() => {
        gameStore.init(token)
    }, [])
    
    return (
        <Container>
            <GameContext.Provider value={gameStore}>
                <GameInner />
            </GameContext.Provider>
        </Container>
    );
};
