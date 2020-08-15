import socket, { Socket } from 'socket.io-client'
import { gameStorage } from '../GameStorage'
import { syncRequest } from '../utils'

export class GameService {
    socket: typeof Socket

    constructor(token: string, playerToken: string) {
        this.socket = socket('http://localhost:4000/game', {
            query: {
                playerToken, token
            }
        })
    }

    getShips() {
        return syncRequest(this.socket, 'get_ships', 'ships_received')
    }

    destroy() {
        this.socket.close()
    }
}