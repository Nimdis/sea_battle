import React, { FC } from 'react'

import { useObserver } from 'mobx-react-lite'

import { GameField } from '../components/GameField'
import { initScreen } from '../entities/initScreen'

export const BattleScreen: FC = () => {
    return useObserver(() => (
        <GameField cells={initScreen.getCells()} />
    ))
}