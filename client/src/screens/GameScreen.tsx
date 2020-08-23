import React, { FC, useMemo, useEffect } from 'react'
import { useObserver } from 'mobx-react-lite'
import { Redirect } from 'react-router';

import { GameContext, useGameStore } from '../GameContext'

import { InitScreen } from './InitScreen'
import { BattleScreen } from './BattleScreen'
import { GameStore } from '../entities/Game';


const GameInner = () => {
    const gameStore = useGameStore()

    return useObserver(() => {
        if (gameStore.initializer.isLoading) {
            return <div>Loading...</div>
        }

        if (gameStore.initializer.hasNoToken) {
            return <Redirect to="/" />
        }

        switch (gameStore.getPhase()) {
            case 'initialization':
                return <InitScreen onStartGame={gameStore.startGame} />
            case 'game':
                return <BattleScreen />
            case 'finished':
            default:
                return <div>Error</div>
        }
    })
};

export const GameScreen: FC = () => {
    const gameStore = useMemo(() => new GameStore('initialization'), [])

    useEffect(() => {
        gameStore.init()
    }, [])
    
    return (
        <GameContext.Provider value={gameStore}>
            <GameInner />
        </GameContext.Provider>
    );
};
