import React, { FC, ReactNode } from 'react'

import styled from 'styled-components'

const GameFieldStyled = styled.div`
    width: 440px;
    height: 202px;
    display: flex;
    justify-content: space-between;
`

export interface IGameFieldProps {
    children: ReactNode
}

export const GameField: FC<IGameFieldProps> = ({ children }) => {
    return <GameFieldStyled>{children}</GameFieldStyled>
}
