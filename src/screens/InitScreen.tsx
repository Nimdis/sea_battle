import React, { FC, useState, useCallback, useEffect } from 'react'

import styled from 'styled-components'

import { Field } from '../components/Field'
import { Cell } from '../components/Cell'
import { IField, ECellType } from '../entities/field'
import { cloneDeepWith, cloneDeep, isUndefined } from "lodash"
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
    rotation: TPosition
    num: number
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
      type: EShip.four,
      rotation: {
          i: 1,
          j: 0
        },
      num: 0
    });

    const [prevPostion, setPrevPosition] = useState<TPosition>()

    const testFree = (filed : IField, point : TPosition) => {
        for(let i = point.i==0?0:-1; i < 2-Math.floor(point.i/9); i++){
            for(let j = point.i==0?0:-1; j < 2-Math.floor(point.i/9); j++){
                if(filed.cells[point.i + i][point.j + j] == ECellType.withShip){
                    return true
                }
            }
        }
        return false
    }

    const addCurrentShip = (field : IField, i: number, j: number) => {
        const a : IField = cloneDeep(field)  
        const axis = i * currentShip.rotation.i + currentShip.rotation.j * j
        const minPoint : number = 0
        const maxPoint : number = currentShip.type
        for(let k = minPoint; k <= maxPoint; k++){
            const currentPoint : TPosition = {
                i: 0,
                j: 0
            }
            if(k + axis > 9){
                currentPoint.i = currentShip.rotation.j * i + currentShip.rotation.i * (9 - k + minPoint)
                currentPoint.j = (9 - k + minPoint) * currentShip.rotation.j + j * currentShip.rotation.i
                a.cells[currentPoint.i][currentPoint.j] = ECellType.withShip;
            }else if(k + axis < 0){
                currentPoint.i = i * currentShip.rotation.j + currentShip.rotation.i * (Math.abs(k) + maxPoint)
                currentPoint.j = (Math.abs(k) + maxPoint) * currentShip.rotation.j + currentShip.rotation.i * j
                a.cells[currentPoint.i][currentPoint.j] = ECellType.withShip;
            }else{
                currentPoint.i = i + k * currentShip.rotation.i
                currentPoint.j = j + k * currentShip.rotation.j
                a.cells[currentPoint.i][currentPoint.j] = ECellType.withShip;
            }
            if(testFree(field, currentPoint)){
                return cells
            }
        }
        return a.cells
    }

    const handleMouseOver = useCallback((i: number, j: number) => () => {
        
        setCells(cloneDeep(addCurrentShip(field, i, j)))
        
      // TODO
      // change field with onFieldChange
    }, [cells])

    const handleOnClick = useCallback((i: number, j: number) => () => {
        onFieldChange(cloneDeep({cells: addCurrentShip(field, i, j)}))

        currentShip.num += 1;
        if(currentShip.num >= MAX_COUNT_BY_SHIP_TYPE[currentShip.type]){
            currentShip.type -= 1;
            currentShip.num = 0;
        }
        
    }, [field])

    const inverseRotation = useCallback(() => {
        setCurrentShip(cloneDeepWith(currentShip, (value : ICurrentShip) => {
            const a : ICurrentShip = cloneDeep(value)
            a.rotation.i = 1 - a.rotation.i
            a.rotation.j = 1 - a.rotation.j
            return a
        }))
    }, [currentShip])

    useEffect(() => {
        document.addEventListener('keypress', e => {
          if (e.keyCode === 32){
            setCurrentShip(cloneDeepWith(currentShip, (value : ICurrentShip) => {
                const a : ICurrentShip = cloneDeep(value)
                a.rotation.i = 1 - a.rotation.i
                a.rotation.j = 1 - a.rotation.j
                return a
            }))
          }
      })
    }, [currentShip])

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
                          onClick={handleOnClick(i, j)}
                          />
                     ))}
                </Row>
            ))}
        </Field>
    );
};
