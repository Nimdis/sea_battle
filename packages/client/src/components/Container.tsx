import styled, { css } from 'styled-components'

export interface IContainerProps {
    centred?: boolean
}

export const Container = styled.div<IContainerProps>`
    margin: 16px auto 0 auto;
    width: 440px;
    height: 200px;

    ${(props) =>
        props.centred &&
        css`
            display: flex;
            justify-content: center;
        `}
`
