import React, { FC, useCallback, useMemo } from 'react'

import { useObserver } from 'mobx-react-lite'
import { toJS } from "mobx"

import { GameField } from '../components/GameField'
import { Field } from '../components/Field'
import { GameStatus } from '../components/GameStatus'
import { useGameStore } from '../GameContext'
import { EnemyShipManager } from '../entities/EnemyShipManager'

class BattleScreenStore {
    private battleManager: EnemyShipManager

    constructor(battleManager: EnemyShipManager) {
        this.battleManager = battleManager
    }

    handleClick = (i: number, j: number) => {
        this.battleManager.shot(i, j)
    }

    getCells(){
        return this.battleManager.getCells()
    }
}

export const BattleScreen: FC = () => {
    const gameStore = useGameStore()
    const battleScreenStore = useMemo(() => new BattleScreenStore(gameStore.getEnemyShipManager()), [])
    
    const handleClick = useCallback((i: number, j: number) => {
        // TODO check if the cell is empty
        if(gameStore.isMyTurn){
            battleScreenStore.handleClick(i, j)
        }
    }, [])

    return useObserver(() => (
        <>
            <GameStatus 
                isMyTurn={gameStore.isMyTurn} 
                winner={gameStore.getWinner()} 
            />
            <GameField>
                <Field cells={gameStore.getCells()} />
                <Field
                    clickable={gameStore.isMyTurn}
                    cells={toJS(battleScreenStore.getCells())}
                    onCellClick={handleClick}
                />
            </GameField>
        </>
    ))
}