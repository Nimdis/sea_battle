import { Server, Socket } from 'socket.io'
import { Game } from '../entities/Game'
import { Player } from '../entities/Player'

export class LobbyService {
    io: Server
    socket: Socket

    constructor(io: Server) {
        this.io = io
    }

    async onNewGame() {
        const game = new Game()
        await game.save()

        const player = new Player()
        player.game = game
        await player.save()
        
        this.socket.emit('game_created', {
            token: game.token,
            playerToken: player.token
        })
    }

    run() {
        this.io.on('connection', (s: Socket) => {
            this.socket = s
            s.on('new_game', this.onNewGame.bind(this))
        })
    }
}