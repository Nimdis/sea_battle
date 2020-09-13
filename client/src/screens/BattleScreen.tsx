import React, { FC, useCallback, useMemo } from 'react'

import { useObserver } from 'mobx-react-lite'
import { toJS } from "mobx"

import { GameField } from '../components/GameField'
import { initScreen } from '../entities/initScreen'
import { useGameStore } from '../GameContext'
import { BattleScreenStore } from '../entities/battleScreen'

export const BattleScreen: FC = () => {
    const gameStore = useGameStore()
    const battleScreenStore = useMemo(() => new BattleScreenStore(gameStore.battleManager), [])
    
    const handleClick = useCallback((i: number, j: number) => {
        if(gameStore.isMyTurn()){
            battleScreenStore.handleClick(i, j)
        }
    }, [])

    const handleMouseOver = useCallback((i: number, j: number) => {
        if(gameStore.isMyTurn()){
            battleScreenStore.handleMouseOver(i, j)
        }
    }, [])

    return useObserver(() => (
        <>
            <div>{gameStore.getWinner()}</div>
            <div>Battle!</div>
            <div>{gameStore.isMyTurn() ? 'My turn' : 'Enemy turn'}</div>
            <GameField cells={initScreen.getCells()} />
            <br />
            <GameField cells={toJS(battleScreenStore.getCells())} 
                       onCellClick={handleClick}
                       onCellOver={handleMouseOver}
                       onCellLeave={battleScreenStore.handleMouseLeave} />
        </>
    ))
}