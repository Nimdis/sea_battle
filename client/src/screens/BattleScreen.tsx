import React, { FC, useCallback, useMemo } from 'react'

import { useObserver } from 'mobx-react-lite'
import { toJS } from "mobx"

import { GameField } from '../components/GameField'
import { Field } from '../components/Field'
import { GameStatus } from '../components/GameStatus'
import { initScreen } from '../entities/initScreen'
import { useGameStore } from '../GameContext'
import { BattleScreenStore } from '../entities/battleScreen'

export const BattleScreen: FC = () => {
    const gameStore = useGameStore()
    const battleScreenStore = useMemo(() => new BattleScreenStore(gameStore.battleManager), [])
    
    const handleClick = useCallback((i: number, j: number) => {
        // TODO check if the cell is empty
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
            <GameStatus 
                isMyTurn={gameStore.isMyTurn()} 
                winner={gameStore.getWinner()} 
            />
            <GameField>
                <Field cells={initScreen.getCells()} />
                <Field
                    clickable={gameStore.isMyTurn()}
                    cells={toJS(battleScreenStore.getCells())}
                    onCellClick={handleClick}
                    onCellOver={handleMouseOver}
                    onCellLeave={battleScreenStore.handleMouseLeave}
                />
            </GameField>
        </>
    ))
}