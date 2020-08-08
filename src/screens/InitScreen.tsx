import React, { FC, useState, useCallback, useEffect } from 'react'

import styled from 'styled-components'

import { Field } from '../components/Field'
import { Cell } from '../components/Cell'
import { EField, ECellType } from '../entities/field'
import { cloneDeepWith, cloneDeep, isUndefined } from "lodash"
import { EShip, TPosition, EInitScreen } from '../entities/initScreen'

const Row = styled.div`
display: flex;
`


export interface IInitScreenProps {
    field: EField
}


type IShipsState = Record<EShip, {
    count: number
    placedShips: TPosition[]
}>


const MAX_COUNT_BY_SHIP_TYPE = {
  [EShip.four]: 1,
  [EShip.three]: 2,
  [EShip.two]: 3,
  [EShip.one]: 4,
}

export const InitScreen: FC<IInitScreenProps> = ({ field }) => {
    console.log("rerender")

    const [prevPostion, setPrevPosition] = useState<TPosition>()
    const [initScreen] = useState(new EInitScreen(field))


    const handleMouseOver = useCallback((i: number, j: number) => () => {
        initScreen.setCurrentShipPosition(i, j)
        initScreen.tempField = field.clone();
        initScreen.addCurrentShip()
      // TODO
      // change field with onFieldChange
    }, [initScreen])

    const handleClick = useCallback((i: number, j: number) => () => {
        field.setCells(initScreen.tempField.clone().getCells())

        initScreen.currentShip.num += 1;
        if(initScreen.currentShip.num >= MAX_COUNT_BY_SHIP_TYPE[initScreen.currentShip.type]){
            initScreen.currentShip.type -= 1;
            initScreen.currentShip.num = 0;
        }
        
    }, [field])

    useEffect(() => {
        const listener = (e : any) => {
            if (e.keyCode === 32){
              initScreen.inverseRotation()
            }
        }
        //document.removeEventListener('keypress', listener)
        document.addEventListener('keypress', listener)
        return () => {
            document.removeEventListener('keypress', listener)
        };
    }, [initScreen.currentShip])

    // TODO
    // space pressed
    // click


    return (
        <Field>
            {initScreen.tempField.getCells().map((row, i) => (
                <Row key={i}>
                    {row.map((type, j) => (
                        <Cell
                          type={type}
                          key={`${i}-${j}`}
                          onMouseOver={handleMouseOver(i, j)}
                          onClick={handleClick(i, j)}
                          />
                     ))}
                </Row>
            ))}
        </Field>
    );
};
