import React, { FC, useState, useCallback, useEffect } from 'react'

import styled from 'styled-components'

import { Field } from '../components/Field'
import { Cell } from '../components/Cell'
import { IField, ECellType } from '../entities/field'
import { cloneDeepWith, cloneDeep } from "lodash"
import { Console } from 'console'

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
    console.log("rerender")
    const [cells, setCells] = useState<ECellType[][]>(field.cells)
    const [shipsState, setShipsState] = useState<IShipsState>();
    const [currentShip, setCurrentShip] = useState<ICurrentShip>({
      position: undefined,
      type: EShip.four
    });

    const [prevPostion, setPrevPosition] = useState<TPosition>()

    const handleMouseOver = useCallback((i: number, j: number) => () => {
        onFieldChange(cloneDeepWith({cells: cells}, (value : IField) => {
            const a : IField = cloneDeep(value)
            //a.cells[i][j] = ECellType.withShip
            return a
        }))
        
      // TODO
      // change field with onFieldChange
    }, [])

    const handleOnClick = useCallback((i: number, j: number) => () => {
        onFieldChange(cloneDeepWith({cells: cells}, (value : IField) => {
            const a : IField = cloneDeep(value)
            a.cells[i][j] = ECellType.withShip
            setCells(a.cells)
            return a
        }))
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
            {field.cells.map((row, i) => (
                <Row key={i}>
                    {row.map((type, j) => (
                        <Cell
                          type={type}
                          key={`${i}-${j}`}
                          onMouseOver={handleMouseOver(i, j)}
                          onClick={handleOnClick(i, j)}
                          />
                     ))}
                </Row>
            ))}
        </Field>
    );
};
