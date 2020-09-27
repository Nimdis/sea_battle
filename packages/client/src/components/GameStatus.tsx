import React, { FC } from 'react'

import styled from 'styled-components'

const GameStatusStyled = styled.div`
    margin-bottom: 16px;
    display: flex;
    justify-content: center;
    font-size: 24px;
`

export interface IGameStatusProps {
    winner?: string
    isMyTurn: boolean
}

export const GameStatus: FC<IGameStatusProps> = ({ winner, isMyTurn }) => {
    return (
        <GameStatusStyled>
            {winner ? (
                <div>{winner}</div>
            ) : (
                <div>{isMyTurn ? 'Your turn' : 'Enemy turn'}</div>
            )}
        </GameStatusStyled>
    )
}
