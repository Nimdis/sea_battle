import "reflect-metadata"
import socket from 'socket.io'
import { createConnection } from "typeorm"
import { createServer } from 'http'
import server from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import { ShipManager, IShip } from './logic/ship' 
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
    const ships: IShip[] = [];
    const shipManager = new ShipManager()
    const player = await Player.findOne({ where: { token: req.headers['x-auth-player'] } })
    let i = 0
    // 1. Метод для размещения шлюпок shipManager.placeRandomShips()
    // 2. Внутри метода нужно вызывать другой метод, который умеет делать 2 вещи, либо разместить корабль, 
    // либо выкинуть ошибку shipManager.createShipByPosition(i, j) -> ship (void) -> throw new Error('Cannot place ship here')
    // mapper Ship -> IShip и IShip -> Ship
    while (true) {
        i++
        if (Math.random() < 0.5) {
            shipManager.rotateCurrentShip()
        }
        if (shipManager.addShipByPostion(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10))) {
            ships.push(shipManager.getCurrentShip())
            const ship = new Ship()
            ship.player = player
            ship.game = player.game
            ship.position = shipManager.getCurrentShip().position
            ship.rotation = shipManager.getCurrentShip().rotation
            ship.size = shipManager.getCurrentShip().size
            if (shipManager.getCurrentShip().num == 4) {
                break
            }
        }
    }
    // TODO write algorythm for random ships
    // Save ships to DB
    // Sent ships to client
    res.json({
        ships,
        cells: shipManager.getCells()
    })
})

const run = async () => {
    await createConnection()
    http.listen(4000)
    console.log('started..')
}

run()