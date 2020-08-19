import React, { FC, ReactNode, MouseEvent } from 'react'

export interface IFieldProps {
    children: ReactNode;
    onMouseLeave?: (e: MouseEvent<HTMLDivElement>) => void;
}

export const Field: FC<IFieldProps> = ({ children, onMouseLeave }) => {
    return (
        <div onMouseLeave={onMouseLeave}>{children}</div>
    )
};