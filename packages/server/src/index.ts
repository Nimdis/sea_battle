import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { createServer } from 'http'
import server from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import socketIO from 'socket.io'

import { routes } from './routes'
import { newGame } from './handlers/newGame'
import { fire } from './handlers/fire'
import { Player } from './entities/Player'
import { PlayerTurn } from './entities/PlayerTurn'
import { Game } from './entities/Game'
import { attachGameIO, attachPlayerIO } from './middlewares'
import { ISocket } from './types'

const app = server()
const http = createServer(app)
const io = socketIO(http)

app.use(bodyParser.json())
app.use(cors())

routes(app)

const findOutPlayerTurn = async (game: Game, player: Player, onSuccess: (isMyTurn: boolean) => void) => {
    game.token
    const turns = await PlayerTurn.findTurnsByGame(game)
    const [playerTurn] = turns

    const isMyTurn = game.isMyTurn(player, playerTurn)
    onSuccess(isMyTurn)
}

io.use(attachGameIO)
io.use(attachPlayerIO)

io.on('connection', (s: ISocket) => {
    const { game, player } = s
    const { token } = game
    const { token: playerToken } = player

    s.join(token)

    if (io.sockets.adapter.rooms[token].length > 2) {
        s.disconnect()
    }

    if (io.sockets.adapter.rooms[token].length == 2) {
        io.in(token).emit('online', 2)
        findOutPlayerTurn(game, player, isMyTurn => {
            s.to(token).emit('playerTurn', !isMyTurn)
            s.emit('playerTurn', isMyTurn)
        })
    }

    s.on('disconnect', () => {
        console.log('disconnect emit')
        s.broadcast.emit('enemyPlayerOffline')
    })

    //s.on('new_game', (token,  playerToken) => newGame(s, io, token, playerToken))

    s.on('fire', async (i, j) => {
        const result = await fire(token, playerToken, i, j)
        if (result) {
            s.to(token).emit('enemyTurn', result)
        }
    })
})

const PORT = 4000

const run = async () => {
    await createConnection()
    http.listen(PORT)
    console.log(`Listen port ${PORT}`)
}

run()
