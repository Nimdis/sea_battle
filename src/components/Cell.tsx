import React, { FC } from 'react'

export const Cell: FC = (key) => {
    console.log(key.children)
    switch(key.children){
        case 0:
            return (<div>O</div>)
        case 1:
            return (<div>X</div>)
        case 2:
            return (<div>Y</div>)
        case 3:
            return (<div>Z</div>)
    }
    return (
        <div>X</div>
    )
};