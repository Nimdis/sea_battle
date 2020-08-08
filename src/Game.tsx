import React, { FC, useState, useCallback } from 'react'
import { useObserver } from 'mobx-react-lite'

import { InitScreen } from './screens/InitScreen'
// import { TGamePhase, TPlayerTurn } from './types'
import { field } from './entities/field'
import { game } from './entities/game'

// useState Field + заполнение
// размещение кораблей
// проставление после клика в стейт

export const Game: FC = () => {
    return useObserver(() => {
        switch (game.getPhase()) {
            case 'initialization':
                return <InitScreen />
            case 'game':
            case 'finished':
            default:
                return <div>Error</div>
        }
    })
};
