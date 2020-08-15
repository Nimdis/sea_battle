import { Namespace } from 'socket.io'

import { ISocket } from '../types'

export class GameService {
    ns: Namespace
    socket: ISocket

    constructor(ns: Namespace) {
        this.ns = ns
    }

    onGetShips(msg: any) {
        console.log(msg)
        console.log('--------')
        this.ns.emit('ships_received', msg)
    }

    run() {
        this.ns.on('connection', (s: ISocket) => {
            console.log('here');
            this.socket = s
            s.on('get_ships', this.onGetShips.bind(this))
        })
    }
}