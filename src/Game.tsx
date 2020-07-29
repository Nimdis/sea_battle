import React, { FC, useState, useCallback } from 'react'

import range from 'lodash/fp/range'

import { InitScreen } from './screens/InitScreen'
import { TGamePhase, TPlayerTurn } from './types'
import { ECellType, IField } from './entities/field'

// useState Field + заполнение
// размещение кораблей
// проставление после клика в стейт

const initialField = {
    cells: range(0, 10).map(() =>
        range(0, 10).map(() => ECellType.empty)
    )
}

export const Game: FC = () => {
    const [gamePhase, setGamePhase] = useState<TGamePhase>('initialization')
    const [playerTurn, setPlayerTurn] = useState<TPlayerTurn>('first')
    const [field, setField] = useState<IField>(initialField)

    const handleFieldChang = useCallback((field: IField) => {
      setField(field)
    }, []);

    switch (gamePhase) {
        case 'initialization':
            return <InitScreen onFieldChange={handleFieldChang} field={field}/>
        case 'game':
        case 'finished':
        default:
            return <div>Error</div>
    }
};
