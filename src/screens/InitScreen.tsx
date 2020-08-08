import React, { FC, useState, useCallback, useEffect } from 'react'

import styled from 'styled-components'
import { useObserver } from 'mobx-react-lite'

import { Field } from '../components/Field'
import { Cell } from '../components/Cell'
import { TShipSize, TPosition, InitScreenStore } from '../entities/initScreen'
import { field } from '../entities/field'

const Row = styled.div`
display: flex;
`


type IShipsState = Record<TShipSize, {
    count: number
    placedShips: TPosition[]
}>


export const InitScreen: FC = () => {
    console.log("rerender")

    const [initScreen] = useState(new InitScreenStore(field.cloneCells()))


    const handleMouseOver = useCallback((i: number, j: number) => () => {
        initScreen.handleMouseOver(i, j)
    }, [initScreen])

    const handleClick = useCallback((i: number, j: number) => () => {
        field.setCells(initScreen.getCells())

        initScreen.currentShip.num += 1;
        if(initScreen.currentShip.num >= MAX_COUNT_BY_SHIP_TYPE[initScreen.currentShip.size]){
            initScreen.currentShip.size -= 1;
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


    return useObserver(() => (
        <Field>
            {initScreen.getCells().map((row, i) => (
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
    ));
};
