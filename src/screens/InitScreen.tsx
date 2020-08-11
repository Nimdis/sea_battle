import React, { FC, useMemo, useCallback, useEffect } from 'react'

import styled from 'styled-components'
import { useObserver } from 'mobx-react-lite'

import { Field } from '../components/Field'
import { Cell } from '../components/Cell'
import { InitScreenStore } from '../entities/initScreen'
import { field } from '../entities/field'

const Row = styled.div`
display: flex;
`

export const InitScreen: FC = () => {
    console.log("rerender")

    const initScreen = useMemo(() => new InitScreenStore(field.cloneCells()), [])

    const handleMouseOver = useCallback((i: number, j: number) => () => {
        initScreen.handleMouseOver(i, j)
    }, [initScreen])

    const handleClick = useCallback((i: number, j: number) => () => {
        initScreen.handleClick(i, j)
    }, [initScreen])

    const handleMouseLeave = useCallback(() => () => {
        initScreen.handleMouseLeave()
    }, [initScreen])

    useEffect(() => {
        const listener = (e: any) => {
            if (e.keyCode === 32) {
                initScreen.handleRotate()
            }
        }
        //document.removeEventListener('keypress', listener)
        document.addEventListener('keypress', listener)
        return () => {
            document.removeEventListener('keypress', listener)
        };
    }, [initScreen])

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
                            onMouseLeave={handleMouseLeave()}
                        />
                    ))}
                </Row>
            ))}
        </Field>
    ));
};
