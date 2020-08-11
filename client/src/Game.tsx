import React, { FC, useEffect } from 'react'
import { useObserver } from 'mobx-react-lite'
import socket from 'socket.io-client'

import { InitScreen } from './screens/InitScreen'
// import { TGamePhase, TPlayerTurn } from './types'
import { field } from './entities/field'
import { game } from './entities/game'

// useState Field + заполнение
// размещение кораблей
// проставление после клика в стейт

export const Game: FC = () => {
    useEffect(() => {
        socket('http://localhost:3000')
    }, [])

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
