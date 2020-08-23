import React, { FC } from 'react'

import { useObserver } from 'mobx-react-lite'

import { GameField } from '../components/GameField'
import { initScreen } from '../entities/initScreen'

export const InitScreen: FC = () => {
    return useObserver(() => {
        return (
            <div>
                <GameField cells={initScreen.getCells()} />
            </div>
        )
    });
};
