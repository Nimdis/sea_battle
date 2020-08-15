import socket, { Socket } from 'socket.io-client'

import { syncRequest } from '../utils'

export interface IGameCreatedMsg {
    token: string
    playerToken: string
}

export class LobbyService {
    socket: typeof Socket

    constructor() {
        this.socket = socket('http://localhost:4000')
    }

    newGame() {
        return syncRequest<IGameCreatedMsg>(this.socket, 'new_game', 'game_created')
    }

    destroy() {
        this.socket.close()
    }
}