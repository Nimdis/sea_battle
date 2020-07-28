import React, { FC, ReactNode } from 'react'

export interface IFieldProps {
    children: ReactNode;
}

export const Field: FC<IFieldProps> = ({ children }) => {
    return (
        <div>{children}</div>
    )
};