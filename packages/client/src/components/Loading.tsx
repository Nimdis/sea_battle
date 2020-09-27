import React, { FC } from 'react'

import styled from 'styled-components'

const LoadingStyled = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    font-size: 24px;
`

export const Loading: FC = () => <LoadingStyled>Loading...</LoadingStyled>
