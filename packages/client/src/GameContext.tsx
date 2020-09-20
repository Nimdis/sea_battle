import { createContext, useContext } from 'react'
import { GameStore } from './entities/Game'

export const GameContext = createContext<GameStore>(new GameStore('initialization'))

export const useGameStore = () => {
    return useContext(GameContext)
}