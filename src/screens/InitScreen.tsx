import React, { FC } from 'react'

import styled from 'styled-components'

import { Field } from '../components/Field'
import { Cell } from '../components/Cell'
import { IField } from '../entities/field'

const Row = styled.div`
display: flex;
`

export interface IInitScreenProps {
    field: IField
}

export const InitScreen: FC<IInitScreenProps> = ({ field }) => {
    const { cells } = field

    return (
        <Field>
            {cells.map((row, i) => (
                <Row key={i}>
                    {row.map((col, j) => (
                        <Cell key={`${i}-${j}`} /> 
                    ))}
                </Row>
            ))}
        </Field>
    );
};