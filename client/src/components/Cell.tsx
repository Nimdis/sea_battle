import React, { FC, MouseEvent } from 'react'

import styled, { css } from 'styled-components'

import { ECellType } from '../entities/CellsStore'

export interface ICellProps {
    type: ECellType;
    clickable: boolean;
    onMouseOver?: (e: MouseEvent<HTMLDivElement>) => void;
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
    onMouseLeave?: () => void
}

interface ICellStyledProps {
    type: ECellType
    clickable: boolean;
}

const CellStyled = styled.div<ICellStyledProps>`
    height: 18px;
    width: 18px;
    border: 1px solid black;


    ${props => props.clickable && css`
        cursor: pointer;

        &:hover {
            background-color: gray;
        }
    `}

    ${props => {
        switch (props.type) {
            case ECellType.withShip:
                return css`
                    background-color: black;
                `
            case ECellType.missed:
                return css`
                    background-color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    &::after {
                        display: inline-block;
                        content: ' ';
                        background-color: black;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                    }
                `
            case ECellType.hitted:
                return css`
                    background-color: orange;
                `
            case ECellType.killed:
                return css`
                    background-color: red;
                `
            default:
                return css`
                    background-color: white;
                `
        }
    }}
`

export const Cell: FC<ICellProps> = props => <CellStyled {...props} />;
