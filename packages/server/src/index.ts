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

const app = server()
const http = createServer(app)
const io = socketIO(http)

app.use(bodyParser.json())
app.use(cors())

// 1. Connect user
// 2. Create room for game
// 3. Connect second user
// 4. Game

routes(app)

io.on('connection', (s) => {
    const { token, playerToken } = s.handshake.query

    console.log(token, playerToken)

    if (!token || !playerToken) {
        console.log('disconnect')
        s.disconnect()
    }

    s.join(token, () => {
        // FIXME
        if (io.sockets.adapter.rooms[token].length > 2) {
            s.disconnect()
        }

        io.in(token).emit('online', 2)
    })

    s.on('disconnect', () => {
        console.log('disconnect emit')
        s.broadcast.emit('enemyPlayerOffline')
    })

    //s.on('new_game', (token,  playerToken) => newGame(s, io, token, playerToken))

    // s.on('fire', (token, playerToken, i, j) => fire(io.to(token), token, playerToken, i, j ))
})

const PORT = 4000

const run = async () => {
    await createConnection()
    http.listen(PORT)
    console.log(`Listen port ${PORT}`)
}

run()
