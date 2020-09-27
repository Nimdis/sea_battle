import { createContext, useContext } from 'react'
import { GameStore } from './entities/GameStore'

export const GameContext = createContext<GameStore>({} as any)

export const useGameStore = () => {
    return useContext(GameContext)
}
