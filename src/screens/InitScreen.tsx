import React, { FC, useState } from 'react'

import styled from 'styled-components'

import { Field } from '../components/Field'
import { Cell } from '../components/Cell'
import { IField } from '../entities/field'

const Row = styled.div`
display: flex;
`
/*const useMouse = (event : any) => {
    const [state, setState] = useState({id : 0})
  
    const mouseOver = (e : any) => {
      setState(state => ({...state, id: e.relatedTarget}))
    }
    return {
      id: state.id,
      mouseOver,
    }
  }*/


 

export interface IInitScreenProps {
    field: IField
}

export const InitScreen: FC<IInitScreenProps> = ({ field }) => {
    //const {x, y, mouseMove} = useMouse()
    const { cells } = field


    return (
        <Field>
            {cells.map((row, i) => (
                <Row key={i}>
                    {row.map((col, j) => (
                        <Cell key={`${i}-${j}`}>{col}</Cell>
                     ))}
                </Row>
            ))}
        </Field>
    );
};