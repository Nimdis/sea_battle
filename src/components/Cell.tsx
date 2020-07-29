import React, { FC, MouseEvent } from 'react'

import { ECellType } from '../entities/field'

export interface ICellProps {
    type: ECellType;
    onMouseOver: (e: MouseEvent<HTMLDivElement>) => void;
}

const getSym = (type: ECellType) => {
    switch(type){
        case ECellType.empty:
            return 'O'
        case ECellType.hitted:
            return 'X'
        case ECellType.missed:
            return 'Y'
        case ECellType.withShip:
            return 'Z'
        default:
            return 'O'
    }
}

export const Cell: FC<ICellProps> = ({ type, onMouseOver }) => {
    return <div onMouseOver={onMouseOver}>{getSym(type)}</div>
};


  

