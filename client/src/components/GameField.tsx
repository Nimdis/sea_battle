import React, { FC } from 'react'

import styled from 'styled-components'

import { Cell } from './Cell'
import { Field } from './Field'
import { TCells } from '../entities/CellsStore';

const Row = styled.div`
display: flex;
`

export interface IGameFieldProps {
    cells: TCells
    onCellClick?: (i: number, j: number) => void
    onCellOver?: (i: number, j: number) => void
    onCellLeave?: () => void
}

export const GameField: FC<IGameFieldProps> = ({ cells, onCellClick, onCellOver, onCellLeave }) => {
    const handleCellClick = (i: number, j: number) => {
        if(onCellClick){
            return () => onCellClick(i, j)
        }
    }

    const handleCellOver = (i: number, j: number) => {
        if(onCellOver){
            return () => onCellOver(i, j)
        }
    }

    return (
        <Field>
            {cells.map((row, i) => (
                <Row key={i}>
                    {row.map((type, j) => (
                        <Cell
                            type={type}
                            key={`${i}-${j}`}
                            onClick={handleCellClick(i, j)}
                            onMouseOver={handleCellOver(i, j)}
                            onMouseLeave={onCellLeave}
                        />
                    ))}
                </Row>
            ))}
        </Field>
    );
};