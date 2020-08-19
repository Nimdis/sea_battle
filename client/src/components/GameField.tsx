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
}

export const GameField: FC<IGameFieldProps> = ({ cells }) => {
    return (
        <Field>
            {cells.map((row, i) => (
                <Row key={i}>
                    {row.map((type, j) => (
                        <Cell
                            type={type}
                            key={`${i}-${j}`}
                        />
                    ))}
                </Row>
            ))}
        </Field>
    );
};