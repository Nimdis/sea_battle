import React, { FC, ReactNode } from 'react'

import styled from 'styled-components'

import { Cell } from './Cell'
import { TCells, ECellType } from '../entities/CellsStore'

const FieldStyled = styled.div`
    border: 1px solid black;
    width: 200px;
`

const Row = styled.div`
    display: flex;
`

export interface IFieldProps {
    cells?: TCells
    children?: ReactNode
    clickable?: boolean
    onCellClick?: (i: number, j: number) => void
    onCellOver?: (i: number, j: number) => void
    onCellLeave?: () => void
}

export const Field: FC<IFieldProps> = ({
    children,
    clickable,
    cells,
    onCellClick,
    onCellOver,
    onCellLeave,
}) => {
    const handleCellClick = (i: number, j: number) => {
        if (onCellClick) {
            return () => onCellClick(i, j)
        }
    }

    const handleCellOver = (i: number, j: number) => {
        if (onCellOver) {
            return () => onCellOver(i, j)
        }
    }

    return (
        <FieldStyled>
            {cells
                ? cells.map((row, i) => (
                      <Row key={i}>
                          {row.map((type, j) => (
                              <Cell
                                  clickable={Boolean(
                                      clickable && type === ECellType.empty
                                  )}
                                  type={type}
                                  key={`${i}-${j}`}
                                  onClick={handleCellClick(i, j)}
                              />
                          ))}
                      </Row>
                  ))
                : children}
        </FieldStyled>
    )
}
