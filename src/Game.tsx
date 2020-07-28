import React, { FC, useState } from 'react'

import { InitScreen } from './screens/InitScreen'
import { TGamePhase, TPlayerTurn } from './types'
import { ECellType, IField } from './entities/field'

// useState Field + заполнение
// размещение кораблей
// проставление после клика в стейт

export const Game: FC = () => {
    const [field, setField] = useState<IField>(() => {
        let a : IField = { cells: [] }
        for(let y = 0; y < 10; y++){
            a.cells.push([])
            for(let x = 0; x < 10; x++){
                a.cells[y].push(ECellType.empty)
            }
        }
        return a
    })

    field.cells[0][0] = ECellType.withShip;

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