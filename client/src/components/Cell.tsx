import React, { FC, MouseEvent } from 'react'

import styled from 'styled-components'

import { ECellType } from '../entities/CellsStore'

export interface ICellProps {
    type: ECellType;
    onMouseOver?: (e: MouseEvent<HTMLDivElement>) => void;
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

const getSym = (type: ECellType) => {
    switch(type){
        case ECellType.empty:
            return 'O'
        case ECellType.withShip:
            return 'X'
        case ECellType.missed:
            return 'Y'
        case ECellType.hitted:
            return 'Z'
        default:
            return 'O'
    }
}

const SCell = styled.div`
height: 20px;
width: 20px;
`

export const Cell: FC<ICellProps> = ({ type, onMouseOver, onClick }) => {
    return <SCell onClick={onClick} onMouseOver={onMouseOver}>{getSym(type)}</SCell>
};




