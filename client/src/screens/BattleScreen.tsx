import React, { FC } from 'react'

import { useObserver } from 'mobx-react-lite'

import { GameField } from '../components/GameField'
import { initScreen } from '../entities/initScreen'
import { useGameStore } from '../GameContext'

export const BattleScreen: FC = () => {
    const gameStore = useGameStore()

    return useObserver(() => (
        <>
            <div>Battle!</div>
            <div>{gameStore.isMyTurn() ? 'My turn' : 'Enemy turn'}</div>
            <GameField cells={initScreen.getCells()} />
        </>
    ))
}