import "reflect-metadata"
import socket from 'socket.io'
import { createConnection } from "typeorm"
import { createServer } from 'http'
import server from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

// import { attachGame, attachPlayer } from './middlewares'

import { Game } from './entities/Game'
import { Player } from './entities/Player'
import { Ship } from './entities/Ship'

const app = server()
const http = createServer(app)

app.use(bodyParser.json())
app.use(cors())

const io = socket(http)

app.post('/new_game', async (_req, res) => {
    const game = new Game()
    await game.save()

    const player = new Player()
    player.game = game
    await player.save()
        
    res.json({
        token: game.token,
        playerToken: player.token
    })
})

app.get('/ships', async (req, res) => {
    console.log(req.headers['x-auth-player'])
    // TODO write algorythm for random ships
    // Save ships to DB
    // Sent ships to client
    res.json({
        ships: []
    })
})

const run = async () => {
    await createConnection()
    http.listen(4000)
    console.log('started..')
}

run()