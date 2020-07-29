import React, { FC, useState, useCallback, useEffect } from 'react'

import styled from 'styled-components'

import { Field } from '../components/Field'
import { Cell } from '../components/Cell'
import { IField } from '../entities/field'

const Row = styled.div`
display: flex;
`

type TPosition = {
    i: number
    j: number
}

export interface IInitScreenProps {
    field: IField
    onFieldChange: (field: IField) => void
}

enum EShip {
    one,
    two,
    three,
    four
}

type IShipsState = Record<EShip, {
    count: number
    placedShips: TPosition[]
}>

interface ICurrentShip {
    position?: TPosition
    type: EShip
}

const MAX_COUNT_BY_SHIP_TYPE = {
  [EShip.four]: 1,
  [EShip.three]: 2,
  [EShip.two]: 3,
  [EShip.one]: 4,
}

export const InitScreen: FC<IInitScreenProps> = ({ field, onFieldChange }) => {
    const { cells } = field
    const [shipsState, setShipsState] = useState<IShipsState>();
    const [currentShip, setCurrentShip] = useState<ICurrentShip>({
      position: undefined,
      type: EShip.four
    });

    const [prevPostion, setPrevPosition] = useState<TPosition>()

    const handleMouseOver = useCallback((i: number, j: number) => () => {
      // TODO
      // change field with onFieldChange
    }, [])

    useEffect(() => {
      document.addEventListener('keypress', e => {
          if (e.keyCode === 32) {
              console.log('here')
          }
      })
    }, [])

    // TODO
    // space pressed
    // click


    return (
        <Field>
            {cells.map((row, i) => (
                <Row key={i}>
                    {row.map((type, j) => (
                        <Cell
                          type={type}
                          key={`${i}-${j}`}
                          onMouseOver={handleMouseOver(i, j)}
                          />
                     ))}
                </Row>
            ))}
        </Field>
    );
};
