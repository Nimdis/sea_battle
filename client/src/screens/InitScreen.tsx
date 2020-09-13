import React, { FC } from 'react'

import { useObserver } from 'mobx-react-lite'

import { GameField } from '../components/GameField'
import { Field } from '../components/Field'
import { initScreen } from '../entities/initScreen'

export const InitScreen: FC = () => {
    return useObserver(() => {
        return (
            <GameField>
                <Field cells={initScreen.getCells()} />
                <Field>
                    <span>Waiting for second player</span>
                </Field>
            </GameField>
        )
    });
};
