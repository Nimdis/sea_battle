import axios from 'axios'

import { IShip } from '../entities/initScreen'
import { TCells,  ECellTurnType } from '../entities/CellsStore';
import { gameStorage } from '../GameStorage';

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
    playerToken: string
}

interface IHeaders {
    token: string
    playerToken?: string | null
}

const getHeaders = ({ token, playerToken }: IHeaders) => {
    if (token && playerToken) {
        return {
            'x-auth-player': playerToken,
            'x-game': token
        }
    }

    return {
        'x-game': token
    }
};

export const getShips = ({ 
    token, 
    playerToken 
}: IHeaders) => r.get<IGetShipsResp>('/ships', {
    headers: getHeaders({ token, playerToken })
}).then(resp => resp.data)

export interface ITurnResp {
    isEnemyOnline: boolean
    isMyTurn: boolean
    turns: any[]
    winner?: string
}

export const turn = () => r.get<ITurnResp>('/turn', {
    headers: getHeaders({ 
        token: gameStorage.getGameToken()!, 
        playerToken: gameStorage.getPlayerToken() 
    })
}).then(resp => resp.data)

export interface IFireResp {
    type: ECellTurnType
}

export const fire = (i: number, j: number) => r.post<IFireResp>('/fire', {i, j}, {
    headers: getHeaders({
        token: gameStorage.getGameToken()!,
        playerToken: gameStorage.getPlayerToken() 
    })
}).then(resp => resp.data)