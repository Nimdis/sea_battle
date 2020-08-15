import "reflect-metadata"
import socket from 'socket.io'
import { createConnection } from "typeorm"

import { attachGame, attachPlayer } from './middlewares'
import { LobbyService } from './services/Lobby'
import { GameService } from './services/Game'

const io = socket()

const gameNS = io.of('/game')

gameNS.use(attachGame)
gameNS.use(attachPlayer)

const ls = new LobbyService(io)
ls.run()
const gs = new GameService(gameNS)
gs.run()

const run = async () => {
    await createConnection()
    io.listen(4000)
    console.log('started..')
}

run()