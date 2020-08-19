import React, { FC, useMemo, useCallback, useEffect } from 'react'

import { useObserver } from 'mobx-react-lite'

import { GameField } from '../components/GameField'
import { initScreen } from '../entities/initScreen'
// import { field } from '../entities/field'

interface IInitScreenProps {
    onStartGame: () => void
}

export const InitScreen: FC<IInitScreenProps> = ({ onStartGame }) => {
    console.log("rerender")

    // const handleMouseOver = useCallback((i: number, j: number) => () => {
    //     initScreen.handleMouseOver(i, j)
    // }, [initScreen])

    // const handleClick = useCallback((i: number, j: number) => () => {
    //     initScreen.handleClick(i, j)
    // }, [initScreen])

    // const handleMouseLeave = useCallback(() => () => {
    //     initScreen.handleMouseLeave()
    // }, [initScreen])

    // useEffect(() => {
    //     const listener = (e: any) => {
    //         if (e.keyCode === 32) {
    //             initScreen.handleRotate()
    //         }
    //     }
    //     //document.removeEventListener('keypress', listener)
    //     document.addEventListener('keypress', listener)
    //     return () => {
    //         document.removeEventListener('keypress', listener)
    //     };
    // }, [initScreen])

    // TODO
    // space pressed
    // click

    return useObserver(() => {
        return (
            <div>
                <button onClick={onStartGame}>Start game!!!!</button>
                <GameField cells={initScreen.getCells()} />
            </div>
        )
    });
};
