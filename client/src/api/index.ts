import axios from 'axios'

import { IShip } from '../entities/initScreen'
import { TCells } from '../entities/CellsStore';

export const r = axios.create({
    baseURL: 'http://localhost:4000'
})

export interface INewGameResp {
    token: string
    playerToken: string
}

export const newGame = () => r.post<INewGameResp>('/new_game').then(resp => resp.data)

export interface IGetShipsResp {
    cells: TCells
    ships: IShip[]
}

export const getShips = ({ 
    token, 
    playerToken 
}: {
    token: string
    playerToken?: string | null
}) => r.get<IGetShipsResp>('/ships', {
    headers: {
        'x-auth-player': playerToken,
        'x-game': token
    }
}).then(resp => resp.data)