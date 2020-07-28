import React, { FC, useState } from 'react'

import { InitScreen } from './screens/InitScreen'
import { TGamePhase, TPlayerTurn } from './types'
import { ECellType, IField } from './entities/field'

const field: IField = {
    cells: [[
        ECellType.empty,
        ECellType.empty,
        ECellType.empty,
        ECellType.empty
    ], [
        ECellType.empty,
        ECellType.empty,
        ECellType.empty,
        ECellType.empty
    ], [
        ECellType.empty,
        ECellType.empty,
        ECellType.empty,
        ECellType.empty
    ], [
        ECellType.empty,
        ECellType.empty,
        ECellType.empty,
        ECellType.empty
    ]]
}

// useState Field + заполнение
// размещение кораблей
// проставление после клика в стейт

export const Game: FC = () => {
    const [gamePhase, setGamePhase] = useState<TGamePhase>('initialization')
    const [playerTurn, setPlayerTurn] = useState<TPlayerTurn>('first')

    switch (gamePhase) {
        case 'initialization':
            return <InitScreen field={field} />;
        case 'game':
        case 'finished':
        default:
            return <div>Error</div>
    }
};