import React, { FC, useMemo } from 'react'

import { useObserver } from 'mobx-react-lite'

import { GameField } from '../components/GameField'
import { Field } from '../components/Field'
import { useGameStore } from '../GameContext'
import { GameStore } from '../entities/GameStore'

class InitScreenStore {
    private gameStore: GameStore

    constructor(gameStore: GameStore) {
        this.gameStore = gameStore
    }

    getCells() {
        return this.gameStore.getCells()
    }
}


export const InitScreen: FC = () => {
    const gameStore = useGameStore()
    const initScreen = useMemo(() => new InitScreenStore(gameStore), []);

    return useObserver(() => {
        return (
            <GameField>
                <Field cells={initScreen.getCells()} />
                <Field>
                    <span>Waiting for second player</span>
                </Field>
            </GameField>
        )
    });
};
